import type { NextPage } from "next";
import { OrgChart } from "../components/OrgChart";
import data from "../data/dummy.json";

const Home: NextPage = () => {
  return <OrgChart source={data} />;
};

export default Home;
