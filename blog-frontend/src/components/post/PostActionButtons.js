import { useState } from 'react';
import '../../style/components/post/post-action-buttons.scss';
import PostRemoveModal from './PostRemoveModal';

const PostActionButtons = ({ onEdit, onRemove }) => {
  const [modal, setModal] = useState(false);
  const onRemoveClick = () => {
    setModal(true);
  };
  const onCancel = () => {
    setModal(false);
  };
  const onConfirm = () => {
    setModal(false);
    onRemove();
  };

  return (
    <div className="post-action-buttons-block">
      <button className="action-button" onClick={onEdit}>
        수정
      </button>
      <button className="action-button" onClick={onRemoveClick}>
        삭제
      </button>
      <PostRemoveModal
        visible={modal}
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    </div>
  );
};

export default PostActionButtons;
