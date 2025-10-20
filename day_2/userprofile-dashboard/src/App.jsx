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
          name="Chinwe Okoro" 
          title="Senior Developer at Paystack" 
          avatar="/path/to/avatar.jpg" 
        />
        <ProfileStats projects={45} followers="1.2K" following={300} />
        <div className="skills">
          <SkillBadge skill="React" level="Expert" />
          <SkillBadge skill="JavaScript" level="Expert" />
          <SkillBadge skill="CSS" level="Intermediate" />
        </div>
      </ProfileCard>
    </div>
  );
}

export default App;