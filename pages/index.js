import Container from "./components/Container";
import Head from "next/head";

export default function Home() {
  
  return (
    <main className="min-h-screen w-[100%] bg-[#cac7c8] flex mx-auto flex-col items-center justify-center"> 
      <Head>
        <title> Level Editor </title>
        <link rel="icon" href="/public/assets/favicon/favicon.png" />
      </Head>

      <Container />
    </main>
  );

}
