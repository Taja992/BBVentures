import { useAtom } from "jotai";
import { userInfoAtom } from "../../atoms/atoms";
import RegisterUser from "../admin/registerUserComponent";
import GetAllUsers from "../admin/allUsersComponent";
import UpdateSelf from "../player/updateSelfComponent";

const ManageUsersPage = () => {
    const [userInfo] = useAtom(userInfoAtom);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 pb-24">
            <div className="container flex space-x-8 p-10 bg-gray-50 rounded-lg shadow-2xl">
                {/* Admin Section */}
                {userInfo?.isAdmin && (
                    <>
                        {/* Register New User */}
                        <section className="flex-1 bg-white p-10 rounded-lg shadow-lg max-w-sm">
                            <RegisterUser />
                        </section>

                        {/* All Users */}
                        <section className="flex-1 bg-white p-10 rounded-lg shadow-lg flex-grow">
                            <GetAllUsers />
                        </section>
                    </>
                )}

                {/* Player Section */}
                {userInfo?.isPlayer && !userInfo?.isAdmin && (
                    <section className="flex-1 bg-white p-10 rounded-lg shadow-lg flex-grow">
                        <UpdateSelf />
                    </section>
                )}
            </div>
        </div>
    );
};

export default ManageUsersPage;
