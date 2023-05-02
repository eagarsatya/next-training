import { WithDefaultLayout } from '@/components/DefautLayout';
import { Title } from '@/components/Title';
import { Page } from '@/types/Page';
import { z } from 'zod';
import { v4 } from 'uuid'
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitButton } from '@/components/SubmitButton';
import { BelajarNextJsBackEndClient } from '@/functions/swagger/BelajarNextJsBackEnd';
import Link from 'next/link';
import { ChangeEvent, useState } from 'react';
import axios from 'axios';

// C- Create
// R- Read
// U- Update
// D- Delete

const FormSchema = z.object({
    name: z.string().nonempty({
        message: 'Nama tidak boleh kosong'
    }),
    email: z.string().nonempty({
        message: 'Email tidak boleh kosong'
    }),
    password: z.string().nonempty({
        message: 'Password tidak boleh kosong'
    }),
});

type FormDataType = z.infer<typeof FormSchema>;

const IndexPage: Page = () => {

    const {
        handleSubmit,
        register,
        formState: { errors },
        reset
    } = useForm<FormDataType>({
        resolver: zodResolver(FormSchema)
    });

    const [imageUrl, setImageUrl] = useState("");
    const [blobId, setBlobId] = useState("");

    async function onSubmit(data: FormDataType) {
        try {
            const client = new BelajarNextJsBackEndClient('http://localhost:3000/api/be');
            await client.userPOST({
                name: data.name,
                email: data.email,
                password: data.password,
                blobId: blobId
            });
            reset();
            setImageUrl("");
        } catch (error) {
            console.error(error);
        }
    }

    async function handleChange(e: ChangeEvent<HTMLInputElement>) {
        const files = e.target.files;
        if (!files) {
            console.log("File Null");
            return;
        }

        const fileName = files[0]?.name;
        const fileType = files[0]?.type;
        const fileId = v4();

        const response = await axios.get<string>(`/api/be/api/blob/presigned-put-object?fileName=${fileId}`)
        // const client = new BelajarNextJsBackEndClient('http://localhost:3000/api/be');
        // const url = await client.presignedPutObject(fileId);
        // axios.put(url, files[0]);

        axios.put(response.data, files[0]);

        axios.post(`/api/be/api/blob/blob-information?id=${fileId}&fileName=${fileName}&mime=${fileType}`);

        const responseUrl = await axios.get(`/api/be/api/blob?fileName=${fileId}`);
        setImageUrl(responseUrl.data);
        setBlobId(fileId);

        e.target.files = null;
    }

    return (
        <div>
            <Title>Create New User</Title>
            <Link href='/user'>Return to Index</Link>

            <h2 className='mb-5 text-3xl'>Create New User</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label htmlFor='name'>Name</label>
                    <input className='mt-1 px-2 py-3 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50' id='name' {...register('name')}></input>
                    <p className='text-red-500'>{errors['name']?.message}</p>
                </div>

                <div>
                    <label htmlFor='email'>Email</label>
                    <input className='mt-1 px-2 py-3 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50' id='email' {...register('email')}></input>
                    <p className='text-red-500'>{errors['email']?.message}</p>
                </div>

                <div>
                    <label htmlFor='password'>Password</label>
                    <input className='mt-1 px-2 py-3 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50' id='password' {...register('password')}></input>
                    <p className='text-red-500'>{errors['password']?.message}</p>
                </div>

                <div>
                    <label htmlFor='profilePicture'>Profile Picture</label>
                    <input type='file' onChange={(e) => handleChange(e)}></input>
                    <img src={imageUrl} alt="Profile Picture"></img>
                </div>

                <div className='mt-5'>
                    <SubmitButton>Submit</SubmitButton>
                </div>
            </form>
        </div>
    );
}

IndexPage.layout = WithDefaultLayout;
export default IndexPage;
