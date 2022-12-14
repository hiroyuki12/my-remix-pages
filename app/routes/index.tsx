import type { MetaFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import React, { useState, useEffect } from 'react';
import lodash from 'lodash';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);
import qiitaStyles from '../QiitaApp.css';

type IndexData = {
  resources: Array<{ name: string; url: string }>;
  demos: Array<{ name: string; to: string }>;
};

// Loaders provide data to components and are only ever called on the server, so
// you can connect to a database or run any server side code you want right next
// to the component that renders it.
// https://remix.run/api/conventions#loader
export let loader: LoaderFunction = () => {
  let data: IndexData = {
    resources: [
      {
        name: "Remix Docs",
        url: "https://remix.run/docs"
      },
      {
        name: "React Router Docs",
        url: "https://reactrouter.com/docs"
      },
      {
        name: "Remix Discord",
        url: "https://discord.gg/VBePs6d"
      }
    ],
    demos: [
      {
        to: "demos/actions",
        name: "Actions"
      },
      {
        to: "demos/about",
        name: "Nested Routes, CSS loading/unloading"
      },
      {
        to: "demos/params",
        name: "URL Params and Error Boundaries"
      }
    ]
  };

  // https://remix.run/api/remix#json
  return json(data);
};

// https://remix.run/api/conventions#meta
export let meta: MetaFunction = () => {
  return {
    title: "Remix Starter",
    description: "Welcome to remix!"
  };
};

export function links() {
  return [
    { rel: "stylesheet", href: qiitaStyles },
  ];
}

// https://remix.run/guides/routing#index-routes
export default function Index() {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [postsList, setPostsList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [tag, setTag] = useState('React');
  const [error, setError] = useState('');

  let data = useLoaderData<IndexData>();

  // ??????????????????????????? handleClick()?????????????????????
  const handleScroll = lodash.throttle(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop !==
      document.documentElement.offsetHeight
    ) {
      return;
    }

    // ????????????????????????????????????
    //if(message !== "loading...") {
      setPage((prevCount) => prevCount + 1);
    //}

  }, 500);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // page???????????????????????????
  useEffect(() => {
    //document.title = `page = ${page}, message = ${message}`;
    handleClick();
    // eslint-disable-next-line
  }, [page]); // Only re-run the effect if count changes

  // tag???????????????????????????
  useEffect(() => {
    //document.title = `page = ${page}, message = ${message}`;
    handleClick();
    // eslint-disable-next-line
  }, [tag]); // Only re-run the effect if count changes

  const tagButtonClick = (target) => {
    setPerPage(20);
    setPostsList([]);
    setPage(1);
    setTag(target);
  }

  const pageButtonClick = (target) => {
    setPerPage(100);
    setPostsList([]);
    const tmp = parseInt(target,10);
    setPage(tmp);
    //setTag('Swift');
  }

  const handleClick = (target) => {
    const url = `https://qiita.com/api/v2/tags/${tag}/items?page=${page}&per_page=${perPage}`;
    setIsLoading(true);

    const headers = {}
    fetch(url, { headers })
      .then(res =>
        res.json().then(data => ({
          ok: res.ok,
          data,
        }))
      )
      .then(res => {
        if (!res.ok) {
          setError(res.data.message);
          setIsLoading(false);
          //throw Error(res.data.message)
        } else {
          setPostsList(postsList.concat(res.data));
          setIsLoading(false);
        }
      })
  }

  const renderTag = (list) => {
    const tags = list.map((item, index) => {
      return (
        <>{item.name}, </>
      );
    });
    return tags;
  }

  const renderImageList = (list) => {
    const posts = list.map((item, index) => {
      return (
        <li className="item" key={index}>
          <div class="card-container">
            <img src={item.user.profile_image_url} width="54" height="54" loading="lazy" alt="img" />
            <div class="card-text">
              <a className="QiitaApp-link" href={item.url} target="_blank" rel="noreferrer">{item.title}</a>
              <div class="card-text2">
                <p>{dayjs(item.created_at).fromNow(true)}
                   / {renderTag(item.tags)} / {item.likes_count}likes / {item.user.items_count}posts</p>
              </div>
            </div>
          </div>
        </li>
      );
    });
    return posts;
  }

  return (
    <div className="remix__page">
      <header className="QiitaApp-header">
        <font color="red"><b>{error}</b></font><br />
        <a className="QiitaApp-link" href="https://mbp.hatenablog.com/entry/2022/08/12/095701" target="_blank" rel="noreferrer">Vercel???Remix(my-remix-pages)</a><br />
        <a className="QiitaApp-link" href="welcome" target="_blank" rel="noreferrer">Welcome</a><br />
        <h3>Qiita???Next.js??????????????????????????????</h3>
	      <br />
        <button onClick={() => {tagButtonClick("React")}}>React</button>
        <button onClick={() => {tagButtonClick("Next.js")}}>Next.js</button>
        <button onClick={() => {tagButtonClick("Vue.js")}}>Vue.js</button>
        <button onClick={() => {tagButtonClick("Nuxt.js")}}>Nuxt.js</button>
        <button onClick={() => {tagButtonClick("JavaScript")}}>JavaScript</button>
        <button onClick={() => {tagButtonClick("Swift")}}>Swift</button>
        <button onClick={() => {tagButtonClick("Vim")}}>Vim</button>
        <button onClick={() => {tagButtonClick("Azure")}}>Azure</button>
        <button onClick={() => {tagButtonClick("Aws")}}>AWS</button>
        <button onClick={() => {tagButtonClick(".NET")}}>.NET</button>
        <button onClick={() => {tagButtonClick("Flutter")}}>Flutter</button>
	{tag}<br />
	page:<button onClick={() => {pageButtonClick("1")}}>__1__</button>
        ___:<button onClick={() => {pageButtonClick("20")}}>__20__</button>
        ___:<button onClick={() => {pageButtonClick("50")}}>__50__</button>
        ___:<button onClick={() => {pageButtonClick("90")}}>__90</button>
	{page}/{perPage}posts
	<ul>{renderImageList(postsList)}</ul>
	Page {page}, tag {tag}, {isLoading}
	<br />
          {isLoading ? (
            <>Loading .... page: {page}/{perPage}posts/{perPage*(page-1)+1}-</>
          ) : (
            <>Not Loading. page: {page}/{perPage}posts/{perPage*(page-1)+1}-</>
          )}
      </header>
      <div className="QiitaApp-footer">{tag} Page {page}/{perPage}posts/{perPage*(page-1)+1}-</div>
    </div>
  );
}
