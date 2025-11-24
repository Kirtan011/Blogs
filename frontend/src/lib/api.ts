import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_STRAPI_URL,
});

/* -----------------------------------------
   GET ALL BLOGS
------------------------------------------ */
export const getAllPosts = async (page = 1, search = "", category = "") => {
  const searchFilter = search
    ? `&filters[title][$containsi]=${encodeURIComponent(search)}`
    : "";

  const categoryFilter = category
    ? `&filters[categories][slug][$eq]=${category}`
    : "";

  const url = `/api/blogs?populate=*&pagination[page]=${page}&pagination[pageSize]=6${searchFilter}${categoryFilter}`;

  const res = await api.get(url);
console.log(`https://blogs-297z.onrender.com/${url}`);
  return {
    posts: res.data.data,
    pagination: res.data.meta.pagination,
  };
};

/* -----------------------------------------
   GET POST BY SLUG
------------------------------------------ */
export const getPostBySlug = async (slug: string) => {
  const res = await api.get(
    `/api/blogs?filters[slug][$eq]=${slug}&populate=*`
  );
  return res.data.data.length ? res.data.data[0] : null;
};

/* -----------------------------------------
   GET POST BY ID (Strapi v5 SAFE WAY)
------------------------------------------ */
export const getPostById = async (id: number) => {
  const res = await api.get(`/api/blogs?filters[id][$eq]=${id}&populate=*`);
  return res.data.data.length ? res.data.data[0] : null;
};

/* -----------------------------------------
   CREATE BLOCKS (Strapi blocks format)
------------------------------------------ */
export const createBlocksFromText = (text: string) => [
  {
    type: "paragraph",
    children: [{ type: "text", text }],
  },
];

/* -----------------------------------------
   CREATE POST
------------------------------------------ */
export const createPost = async (postData: any) => {
  const payload = {
    data: {
      title: postData.title,
      slug: postData.slug,
      description: postData.description,
      content: postData.content, // must be ARRAY
    },
  };

  console.log("SENDING:", JSON.stringify(payload, null, 2));

  const res = await api.post("/api/blogs", payload);

  return res.data.data; // { id, ... }
};

/* -----------------------------------------
   UPLOAD IMAGE
------------------------------------------ */
export const uploadImage = async (file: File) => {
  const form = new FormData();
  form.append("files", file);

  const res = await api.post("/api/upload", form);

  return res.data[0]; // { id, url }
};

/* -----------------------------------------
   ATTACH COVER IMAGE
------------------------------------------ */
export const attachCoverImage = async (postId: number, imageId: number) => {
  return api.put(`/api/blogs/${postId}`, {
    data: { cover: imageId },
  });
};

/* -----------------------------------------
   ATTACH CATEGORY
------------------------------------------ */
export const attachCategory = async (postId: number, categoryId: number) => {
  return api.put(`/api/blogs/${postId}`, {
    data: { categories: [categoryId] },
  });
};

/* -----------------------------------------
   GET ALL CATEGORIES
------------------------------------------ */
export const getAllCategories = async () => {
  const res = await api.get("/api/categories?populate=*");
  return res.data.data;
};
