import Image from "next/image";
import { useRouter } from "next/navigation";

const dow = {
  0: "SUN",
  1: "MON",
  2: "TUE",
  3: "WED",
  4: "THU",
  5: "FRI",
  6: "SAT",
};

const convertTimeSting = (t) => {
  const timeObject = new Date(t);
  return `${dow[timeObject.getDay()]} ${timeObject.toLocaleString()}`;
};
const Comment = ({ data }) => {
  const router = useRouter();

  const profileHandler = () => {
    if (data.myNewComment) {
      router.push(`/profile`);
    } else {
      router.push(`/profile/${data.commenter._id}`);
    }
  };

  return (
    <div className="mt-2">
      <div
        className="flex-1 flex justify-start items-center gap-3 cursor-pointer"
        onClick={profileHandler}
      >
        <Image
          src={data.commenter.image}
          alt="user"
          width={30}
          height={30}
          className="rounded-full object-containe"
        />
        <div className="flex flex-col">
          <h3 className="font-inter text-sm text-gray-900">
            {data.commenter.username}
          </h3>
          <p className="font-inter text-xs text-gray-500">
            {convertTimeSting(data.createdAt)}
          </p>
        </div>
      </div>
      <p className="text-sm mt-1">{data.detail}</p>
    </div>
  );
};

export default Comment;
