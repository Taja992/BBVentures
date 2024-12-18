import { useAtom } from "jotai";
import { userInfoAtom } from "../../atoms/atoms";
import RegisterUser from "../admin/registerUserComponent";
import GetAllUsers from "../admin/allUsersComponent";
import UpdateSelf from "../player/updateSelfComponent";

const ManageUsersPage = () => {
    const [userInfo] = useAtom(userInfoAtom);

    return (
        <div className="container mx-auto p-6 space-y-6 bg-gray-50 rounded-md shadow-lg">
            <div className="flex flex-wrap gap-6">
                {/* Admin Section */}
                {userInfo?.isAdmin && (
                    <>
                        {/* Register New User */}
                        <section className="flex-1 bg-white p-6 rounded-md shadow max-w-xs">
                            <RegisterUser />
                        </section>

                        {/* All Users */}
                        <section className="flex-1 bg-white p-6 rounded-md shadow flex-grow">
                            <h2 className="text-xl font-bold mb-4 text-gray-800">All Users</h2>
                            <GetAllUsers />
                        </section>
                    </>
                )}

                {/* Player Section */}
                {userInfo?.isPlayer && !userInfo?.isAdmin && (
                    <section className="flex-1 bg-white p-6 rounded-md shadow flex-grow">
                        <h2 className="text-xl font-bold mb-4 text-gray-800">Update Profile</h2>
                        <UpdateSelf />
                    </section>
                )}
            </div>
        </div>
    );
};

export default ManageUsersPage;
