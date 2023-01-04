import '../../style/components/write/write-action-buttons.scss';
import Button from '../common/Button';

const WriteActionButtons = ({ onPublish, onCancel }) => {
  return (
    <div className="write-action-buttons-block">
      <Button cyan={true} onClick={onPublish}>
        포스트 등록
      </Button>
      <Button onClick={onCancel}>취소</Button>
    </div>
  );
};

export default WriteActionButtons;
