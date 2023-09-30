import Feed from "@components/Feed"

const Home = () => {
  return (
    <section className="w-full flex-center flex-col">
      <h1 className="head_text text_center">
        Discover and Share
        <br className="max-md:hidden" />
        <span className="orange_gradient">AI-Powered Prompt</span>
      </h1>
      <p className=" desc text-center">
        <strong>Prompt Mai?</strong> Get ready for the modern AI-Powered world
        with this open-source tool for discover and share creative prompts
      </p>

      <Feed />
    </section>
  );
};

export default Home;
