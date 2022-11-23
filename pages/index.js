import Head from "next/head";

import { withSSRContext } from "aws-amplify";
import { DataStore } from '@aws-amplify/datastore';
import { Post } from "../src/models";

import Image from "next/image";

import { useState } from "react";
import { useRouter } from "next/router";

export default function Home({ posts }) {
  const [post, setPost] = useState({
    title: "",
    content: "",
  });
  const { title, content } = post;
  const router = useRouter();

  const handleChange = (e) => {
    setPost((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  async function handleCreatePost(event) {
    event.preventDefault();
    
    await DataStore.save(
      new Post({
      "title": post.title,
      "content": post.content,
      "Comments": []
    })
  );
  }

  return (
    <div>
      <Head>
        <title>Amplify + Next</title>
        <meta name="description" content="Amplify + Next!" />
      </Head>

      <h1>Amplify + Next</h1>
      <Image src="/blair.jpeg" alt="Blair" height={200} width={150} />

      <main>
        {posts.map((post) => (
          <div key={post.id}>
            <a href={`/post/${post.id}`}>
              <h2>{post.title}</h2>
            </a>
          </div>
        ))}

        <form onSubmit={handleCreatePost}>
          <fieldset>
            <legend>Title</legend>
            <input
              name="title"
              value={post.title}
              onChange={handleChange}
            />
          </fieldset>

          <fieldset>
            <legend>Content</legend>
            <textarea
              name="content"
              value={post.content}
              onChange={handleChange}
            />
          </fieldset>

          <button>Create Post</button>
        </form>
      </main>
    </div>
  );
}

export async function getServerSideProps(context) {
  const SSR = withSSRContext(context.req);
  const models = await SSR.DataStore.query(Post);

  return {
    props: {
      posts: JSON.parse(JSON.stringify(models)),
    },
  };
}
