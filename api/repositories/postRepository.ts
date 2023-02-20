import { v4 } from "uuid"

const posts = [
  {
    id: v4(),
    user_id: v4(),
    title: "Hello World",
    content:
      "Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World"
  },
  {
    id: v4(),
    user_id: v4(),
    title: "Hello World 2",
    content:
      "Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World"
  },
  {
    id: v4(),
    user_id: v4(),
    title: "Hello World 3",
    content:
      "Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World"
  }
]

class postController {
  findAll() {
    return posts
  }

  findAllByUserId(userId: string) {}

  findById(id: string) {
    return posts.find((post) => post.id === id)
  }

  create({ title, content }: { title: string; content: string }) {
    const post = {
      id: v4(),
      user_id: v4(),
      title,
      content
    }
    posts.push(post)
    return post
  }

  delete(id: string) {
    const deletedPost = posts.filter((post) => post.id === id)

    posts.splice(posts.indexOf(deletedPost[0]), 1)

    return deletedPost
  }

  update(id: string, { title, content }: { title: string; content: string }) {
    let post = posts.find((post) => post.id === id)!

    posts.splice(posts.indexOf(post), 1, {
      id: post.id,
      user_id: post.user_id,
      title,
      content
    })

    post = posts.find((post) => post.id === id)!

    return post
  }
}

export default new postController()
