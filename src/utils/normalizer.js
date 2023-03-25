export function postNormalizer(data) {
  console.log(post);

  return data.map(post => {
    console.log(post);
    //     return {
    //       id: post.id,
    //       post: post.post,
    //       postImg: post.postImg,
    //       createdAt: post.createdAt,
    //       user: {
    //         id: post.user.id,
    //         name: post.user.name,
    //         email: post.user.email,
    //         profileImg: post.user.profileImg,
    //       },
    //     };
    //   });
  });
}
