import { WithDefaultLayout } from "@/components/DefautLayout";
import { Title } from "@/components/Title";
import { Page } from "@/types/Page";
import { v4 } from "uuid"
import axios from "axios";
import { ChangeEvent, useState } from "react";

const IndexPage: Page = () => {

    const [imageUrl, setImageUrl] = useState("");

    async function handleChange(e: ChangeEvent<HTMLInputElement>) {
        const files = e.target.files;

        if (!files) {
            console.log("File Null");
            return;
        }

        const fileName = files[0]?.name;
        const fileType = files[0]?.type;
        const fileId = v4();

        const response = await axios.get<string>(`api/be/api/blob/presigned-put-object?fileName=${fileId}`)
        axios.put(response.data, files[0]);

        axios.post(`api/be/api/blob/blob-information?id=${fileId}&fileName=${fileName}&mime=${fileType}`);

        const responseUrl = await axios.get(`api/be/api/blob?fileName=${fileId}`);
        setImageUrl(responseUrl.data);
    }

    return (
        <div>
            <Title>File Upload</Title>
            <h2 className='mb-5 text-3xl'>File Upload</h2>

            <input type="file" onChange={(e) => handleChange(e)}></input>

            <img src={imageUrl} alt="User Upload" ></img>
        </div>
    );
}

IndexPage.layout = WithDefaultLayout;
export default IndexPage;