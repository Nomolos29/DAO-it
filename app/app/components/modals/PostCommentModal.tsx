import React from 'react'
import PostComment from '../PostComment'
import { PostCommentModalProps } from '../../types/types'

const PostCommentModal:React.FC<PostCommentModalProps> = ({proposalId}) => {
  return (
    <div>
      <PostComment proposalId={proposalId} />
    </div>
  )
}

export default PostCommentModal