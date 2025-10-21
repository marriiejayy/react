// App.jsx
import ProfileCard from './ProfileCard';
import ProfileHeader from './ProfileHeader';
import ProfileStats from './ProfileStats';
import SkillBadge from './SkillBadge';

function App() {
  return (
    <div>
      <ProfileCard>
        <ProfileHeader 
          name="Adesewa Mary" 
          title="AI Developer at Paystack" 
          avatar="https://cdn.pixabay.com/photo/2017/10/10/00/49/female-2835524_1280.jpg" 
        />
        <ProfileStats projects={45} followers="1.2K" following={300} />
        <div className="skills">
          <SkillBadge skill="React" level="Beginner" />
          <SkillBadge skill="JavaScript" level="Expert" />
          <SkillBadge skill="CSS" level="Intermediate" />
        </div>
      </ProfileCard>
    </div>
  );
}

export default App;