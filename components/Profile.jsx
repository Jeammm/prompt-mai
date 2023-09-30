import PromptCard from "./PromptCard";
import { useRouter } from "next/navigation";

const Profile = ({ name, desc, data, handleEdit, handleDelete }) => {
  const router = useRouter();
  const handleTagClick = (post) => {
    router.push(`/?search=${post}`);
  };
  return (
    <section className="w-full">
      <h1 className="head_text text-left">
        <span className="blue_gradient">{name} profile</span>
      </h1>
      <p className="desc text-left">{desc}</p>

      <div className="mt-10 prompt_layout">
        {data.map((post, index) => (
          <PromptCard
            post={post}
            key={post._id}
            handleEdit={() => handleEdit && handleEdit(post)}
            handleDelete={() => handleDelete && handleDelete(post)}
            handleTagClick={handleTagClick}
          />
        ))}
      </div>
    </section>
  );
};

export default Profile;
