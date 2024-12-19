import { useAtom } from "jotai";
import { userInfoAtom } from "../../atoms/atoms";
import RegisterUser from "../admin/registerUserComponent";
import GetAllUsers from "../admin/allUsersComponent";
import UpdateSelf from "../player/updateSelfComponent";

const ManageUsersPage = () => {
    const [userInfo] = useAtom(userInfoAtom);

    return (
        <div className="flex items-center justify-center py-4 px-4">
            <div className="flex space-x-4 p-4 bg-gray-50 rounded-lg shadow-md">
                {/* Admin Section */}
                {userInfo?.isAdmin && (
                    <>
                        {/* Register New User */}
                        <section className="flex-1 bg-white p-4 rounded-lg shadow-md max-w-xs">
                            <RegisterUser />
                        </section>

                        {/* All Users */}
                        <section className="flex-1 bg-white p-4 rounded-lg shadow-md flex-grow">
                            <GetAllUsers />
                        </section>
                    </>
                )}

                {/* Player Section */}
                {userInfo?.isPlayer && !userInfo?.isAdmin && (
                    <section className="flex-1 bg-white p-4 rounded-lg shadow-md flex-grow">
                        <UpdateSelf />
                    </section>
                )}
            </div>
        </div>
    );
};

export default ManageUsersPage;
