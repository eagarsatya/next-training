import { WithDefaultLayout } from '@/components/DefautLayout';
import { Button } from "antd";
import { Title } from '@/components/Title';
import { UserModel, ResponseUserOffsetModel } from '@/functions/swagger/BelajarNextJsBackEnd';
import { useSwrFetcherWithAccessToken } from '@/functions/useSwrFetcherWithAccessToken';
import { Page } from '@/types/Page';
import { Alert } from 'antd';
import { useState } from 'react';
import useSwr from 'swr';

// C- Create
// R- Read
// U- Update
// D- Delete

const UserTableRow: React.FC<{
    user: UserModel,
}> = ({ user }) => {

    return (
        <tr>
            <td className="border px-4 py-2">{user.id}</td>
            <td className="border px-4 py-2">{user.name}</td>
            <td className="border px-4 py-2">{user.email}</td>
            <td className="border px-4 py-2">
                {/* <img src={user.fileUrl} alt="Profile Picture"></img> */}
                <img src={`/api/be/api/blob/redirect?fileName=${user.blobId}`} alt="Profile Picture"></img>
            </td>
        </tr>
    );
};

const IndexPage: Page = () => {
    const [pageIndex, setPageIndex] = useState(0);

    const swrFetcher = useSwrFetcherWithAccessToken();
    const { data, error } = useSwr<ResponseUserOffsetModel>(`api/be/api/User/offset-pagination?limit=2&offset=${pageIndex}`, swrFetcher);

    return (
        <div>
            <Title>Manage User</Title>
            <h2 className='mb-5 text-3xl'>Manage User</h2>

            {Boolean(error) && <Alert type='error' message='Cannot get Brands data' description={String(error)}></Alert>}
            <table className='table-auto mt-5'>
                <thead className='bg-slate-700 text-white'>
                    <tr>
                        <th className='px-4 py-2'>ID</th>
                        <th className='px-4 py-2'>Name</th>
                        <th className='px-4 py-2'>Email</th>
                        <th className='px-4 py-2'>Profile Picture</th>
                    </tr>
                </thead>
                <tbody>
                    {data?.users?.map((x, i) => <UserTableRow key={i} user={x}></UserTableRow>)}
                </tbody>
            </table>

            <Button type='default' onClick={() => setPageIndex(pageIndex - 1)}>Previous</Button>
            <Button type='default' onClick={() => setPageIndex(pageIndex + 1)}>Next</Button>
        </div>
    );
}

IndexPage.layout = WithDefaultLayout;
export default IndexPage;
