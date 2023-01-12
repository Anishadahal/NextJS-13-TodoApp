import React from "react";
import { Todo } from "../../../typings";
import { notFound } from "next/navigation";

type PageProps = {
  params: {
    todoId: string;
  };
};

export const dynamicParams = true;

const fetchTodo = async (todoId: string) => {
  const res = await fetch(`https://jsonplaceholder.typicode.com/todos/${todoId}`, {
    next: { revalidate: 60 },
  });
  const todo: Todo = await res.json();
  return todo;
};
const TodoPage = async ({ params: { todoId } }: PageProps) => {
  const todo = await fetchTodo(todoId);

  if (!todo.id) {
    return notFound();
  }

  return (
    <div className="p-10 mt-2 bg-yellow-200 border-2 shadow-lg">
      <p>
        #{todoId}: {todo.title}
      </p>
      <p className="mt-5 text-right border-t border-black">By user: {todo.userId}</p>
    </div>
  );
};

export default TodoPage;

export async function generateStaticParams() {
  const res = await fetch(`https://jsonplaceholder.typicode.com/todos/`);
  const todos: Todo[] = await res.json();

  //for demo: splice 10 todo items
  const trimmedTodos: Todo[] = todos.splice(0, 10);

  return todos.map((todo: Todo) => ({
    todoId: todo.id.toString(),
  }));
}
