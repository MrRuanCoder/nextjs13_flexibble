import { GraphQLClient } from "graphql-request";

import { createProjectMutation, createUserMutation, deleteProjectMutation, updateProjectMutation, getProjectByIdQuery, getProjectsOfUserQuery, getUserQuery, projectsQuery } from "@/graphql";
import { ProjectForm } from "@/common.types";

const isProduction = process.env.NODE_ENV === 'production';
// 如果 process.env.NEXT_PUBLIC_GRAFBASE_API_URL 是一个存在的值（非空或非假），它将被选择，否则，空字符串 '' 会被选择作为默认值。
const apiUrl = isProduction ? process.env.NEXT_PUBLIC_GRAFBASE_API_URL || '' : 'http://127.0.0.1:4000/graphql';
const apiKey = isProduction ? process.env.NEXT_PUBLIC_GRAFBASE_API_KEY || '' : 'letmein';
const serverUrl = isProduction ? process.env.NEXT_PUBLIC_SERVER_URL : 'http://localhost:3000';

const client = new GraphQLClient(apiUrl);

export const fetchToken = async () => {
  try {
    const response = await fetch(`${serverUrl}/api/auth/token`);
    return response.json();
  } catch (err) {
    throw err;
  }
};

export const uploadImage = async (imagePath: string) => {
  try {
    const response = await fetch(`${serverUrl}/api/upload`, {
      method: "POST",
      body: JSON.stringify({
        path: imagePath,
      }),
    });
    return response.json();
  } catch (err) {
    throw err;
  }
};

const makeGraphQLRequest = async (query: string, variables = {}) => {
  try {
    //GraphQL（Graph Query Language）是一种用于查询和操作数据的开放源码数据查询语言。
    //client.request(query, variables): 这是一个 GraphQL 客户端（可能是一个库或工具）的请求方法。
    // 它接受两个参数，一个是 GraphQL 查询字符串 (query)，另一个是查询的变量 (variables)。它会将查询发送到 GraphQL 服务器，并等待服务器的响应。
    //
    //
    return await client.request(query, variables);
  } catch (err) {
    throw err;
  }
};

export const fetchAllProjects = (category?: string | null, endcursor?: string | null) => {
  client.setHeader("x-api-key", apiKey);

  return makeGraphQLRequest(projectsQuery, { category, endcursor });
};

export const createNewProject = async (form: ProjectForm, creatorId: string, token: string) => {
  const imageUrl = await uploadImage(form.image);

  if (imageUrl.url) {
    client.setHeader("Authorization", `Bearer ${token}`);

    const variables = {
      input: { 
        ...form, 
        image: imageUrl.url, 
        createdBy: { 
          link: creatorId 
        }
      }
    };

    return makeGraphQLRequest(createProjectMutation, variables);
  }
};

export const updateProject = async (form: ProjectForm, projectId: string, token: string) => {
  function isBase64DataURL(value: string) {
    const base64Regex = /^data:image\/[a-z]+;base64,/;
    return base64Regex.test(value);
  }

  let updatedForm = { ...form };

  const isUploadingNewImage = isBase64DataURL(form.image);

  if (isUploadingNewImage) {
    const imageUrl = await uploadImage(form.image);

    if (imageUrl.url) {
      updatedForm = { ...updatedForm, image: imageUrl.url };
    }
  }

  client.setHeader("Authorization", `Bearer ${token}`);

  const variables = {
    id: projectId,
    input: updatedForm,
  };

  return makeGraphQLRequest(updateProjectMutation, variables);
};

export const deleteProject = (id: string, token: string) => {
  client.setHeader("Authorization", `Bearer ${token}`);
  return makeGraphQLRequest(deleteProjectMutation, { id });
};

export const getProjectDetails = (id: string) => {
  client.setHeader("x-api-key", apiKey);
  return makeGraphQLRequest(getProjectByIdQuery, { id });
};

export const createUser = (name: string, email: string, avatarUrl: string) => {
  client.setHeader("x-api-key", apiKey);

  const variables = {
    input: {
      name: name,
      email: email,
      avatarUrl: avatarUrl
    },
  };
  
  return makeGraphQLRequest(createUserMutation, variables);
};

export const getUserProjects = (id: string, last?: number) => {
  client.setHeader("x-api-key", apiKey);
  return makeGraphQLRequest(getProjectsOfUserQuery, { id, last });
};

export const getUser = (email: string) => {
  client.setHeader("x-api-key", apiKey);
  return makeGraphQLRequest(getUserQuery, { email });
};
