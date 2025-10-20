// SkillBadge.jsx
import './SkillBadge.css';

function SkillBadge({ skill, level }) {
  const getLevelColor = (level) => {
    switch (level) {
      case 'Beginner':
        return 'gray';
      case 'Intermediate':
        return 'blue';
      case 'Expert':
        return 'green';
      default:
        return 'gray';
    }
  };

  const badgeStyle = {
    backgroundColor: getLevelColor(level),
  };

  return (
    <span className="skill-badge" style={badgeStyle}>
      {skill} - {level}
    </span>
  );
}

export default SkillBadge;