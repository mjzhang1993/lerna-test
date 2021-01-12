import * as React from 'react';
import Button from './Button';
import './NoteButton.less';

const NoteButton: React.FC = () => (
  <div className="note-container">
    <Button className="note-button">this is Note Button</Button>
    <div className="note-bg" />
  </div>
);

export default NoteButton;
