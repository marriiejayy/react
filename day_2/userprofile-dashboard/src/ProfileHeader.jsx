// ProfileHeader.jsx
import './ProfileHeader.css';

function ProfileHeader({ name, title, avatar }) {
  return (
    <div className="profile-header">
      <img src={avatar} alt={name} className="avatar" />
      <h1>{name}</h1>
      <p>{title}</p>
    </div>
  );
}

export default ProfileHeader;