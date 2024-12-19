import { useAtom } from "jotai";
import { userInfoAtom } from "../atoms/atoms";
import RegisterUser from "../components/admin/registerUserComponent";
import GetAllUsers from "../components/admin/allUsersComponent";
import UpdateSelf from "../components/player/updateSelfComponent";


const ManageUsersPage = () => {
    const [userInfo] = useAtom(userInfoAtom);

    return (
        <div className="flex items-center justify-center py-4 px-4">
            <div className="flex h-4/5 space-x-4 p-4 rounded-lg shadow-md">
                {/* Admin Section */}
                {userInfo?.isAdmin && (
                    <>
                        {/* Register New User */}
                        <section className="w-full bg-white p-4 rounded-lg shadow-md max-w-xs">
                            <RegisterUser />
                        </section>

                        {/* All Users */}
                        <section>
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
