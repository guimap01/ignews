import type { GetStaticProps, NextPage } from 'next';
import Prismic from '@prismicio/client';
import Head from 'next/head';
import Client from 'services/prismic';
import { RichText } from 'prismic-dom';

import styles from './styles.module.scss';

type Post = {
  slug: string;
  title: string;
  excerpt: string;
  updatedAt: string;
};

type PostProps = {
  posts: Post[];
};

const Posts: NextPage<PostProps> = ({ posts }) => {
  return (
    <>
      <Head>
        <title>Posts | ig.news</title>
      </Head>
      <main className={styles.container}>
        <div className={styles.posts}>
          {posts.map((post) => (
            <a key={post.slug}>
              <time>{post.updatedAt}</time>
              <strong>{post.title}</strong>
              <p>{post.excerpt}</p>
            </a>
          ))}
        </div>
      </main>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const response = await Client().query(
    [Prismic.predicates.at('document.type', 'post')],
    {
      fetch: ['post.title', 'post.content'],
      pageSize: 100,
    }
  );
  const posts = response.results.map((post: any) => ({
    slug: post.uid,
    title: RichText.asText(post.data.title),
    excerpt:
      post.data.content.find((content: any) => content.type === 'paragraph')
        ?.text ?? '',
    updatedAt: new Date(post.last_publication_date).toLocaleDateString(
      'pt-BR',
      {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }
    ),
  }));
  return {
    props: { posts },
    revalidate: 60 * 60 * 24,
  };
};

export default Posts;
