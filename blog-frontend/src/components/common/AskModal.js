import '../../style/components/common/ask-modal.scss';
import Button from './Button';

const AskModal = ({
  visible,
  title,
  description,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
}) => {
  if (!visible) return null;
  return (
    <div className="fullscreen">
      <div className="ask-modal-block">
        <h2>{title}</h2>
        <p>{description}</p>
        <div className="buttons">
          <Button onClick={onCancel}>{cancelText}</Button>
          <Button onClick={onConfirm}>{confirmText}</Button>
        </div>
      </div>
    </div>
  );
};

export default AskModal;
