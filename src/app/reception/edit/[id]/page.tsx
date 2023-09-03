"use client";

import { error } from 'console';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef } from 'react'

type UpdateBlogParams = {
  title: string | undefined, 
  description: string | undefined,
  id: number
};

const updateBlog = async (data: UpdateBlogParams) => {
  const res = await fetch(`http://localhost:3000/api/reception/${data.id}`, {
    method: "PUT",
    body: JSON.stringify({ title: data.title, description: data.description }),
    headers:{
      "Content-Type": "application/JSON",
    },
  });
  return (await res).json();
};

const deleteBlog = async (id: number) => {
  const res = await fetch(`http://localhost:3000/api/reception/${id}`, {
    method: "DELETE",
    headers:{
      "Content-Type": "application/JSON",
    },
  });
  return (await res).json();
};

const getBlogById = async (id: number) => {
  const res = await fetch(`http://localhost:3000/api/reception/${id}`);
  const data = await res.json();
  return data.post;
};

const EditBlog = ({ params }: { params: { id: number } }) => {
  const router = useRouter();
  const titleRef = useRef<HTMLInputElement | null >(null);
  const descriptionRef = useRef<HTMLTextAreaElement | null >(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if(titleRef.current && descriptionRef.current){
    
      await updateBlog({
        title: titleRef.current?.value,
        description: descriptionRef.current?.value,
        id: params.id,
      });
  
      router.push("/");
      router.refresh();
    };
  };

  const handleDelete = async () => {
    await deleteBlog(params.id);
  };

  useEffect(() => {
    getBlogById(params.id)
      .then((data) => {
        if(titleRef.current && descriptionRef.current) {
          titleRef.current.value = data.title;
          descriptionRef.current.value = data.description;
        }
      })
      .catch((err) => {
        console.log("エラーが発生しました");
      });
  }, [params.id]);

  return (
    <>
      <div className="w-full m-auto flex my-4">
        <div className="flex flex-col justify-center items-center m-auto">
          <p className="text-2xl text-slate-200 font-bold p-3">ブログの編集 🚀</p>
          <form onSubmit={handleSubmit}>
            <input
              ref={titleRef}
              placeholder="タイトルを入力"
              type="text"
              className="rounded-md px-4 w-full py-2 my-2"
            />
            <textarea
              ref={descriptionRef}
              placeholder="記事詳細を入力"
              className="rounded-md px-4 py-2 w-full my-2"
            ></textarea>
            <button className="font-semibold px-4 py-2 shadow-xl bg-slate-200 rounded-lg m-auto hover:bg-slate-100">
              更新
            </button>
            <button onClick={handleDelete} className="ml-2 font-semibold px-4 py-2 shadow-xl bg-red-400 rounded-lg m-auto hover:bg-slate-100">
              削除
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditBlog