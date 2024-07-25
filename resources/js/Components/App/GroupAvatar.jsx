import { HiUsers } from "react-icons/hi2";

export const GroupAvatar = () => {
    return (
        <>
            <div className={`avatar placeholder`}>
                <div className="bg-gray-400 text-gray-800 rounded-full w-8">
                    <span className="text-xl">
                        <HiUsers className="w-4 h-4" />
                    </span>
                </div>
            </div>
        </>
    );
};
