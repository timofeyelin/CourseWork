import { Edit as EditIcon } from '@mui/icons-material';
import { INFO_MESSAGES } from '../../../utils/constants';
import { GlassButton } from '../../../components/common';
import { 
    HeaderSection, 
    HeaderContent, 
    UserInfo, 
    StyledAvatar, 
    UserDetails, 
    UserEmail, 
    RegistrationDate 
} from '../Profile.styles';

const ProfileHeader = ({ profile, onEditProfile }) => {
    const getInitials = (name) => {
        if (!name) return 'U';
        return name
            .split(' ')
            .map(word => word[0])
            .slice(0, 2)
            .join('')
            .toUpperCase();
    };

    return (
        <HeaderSection>
            <HeaderContent>
                <UserInfo>
                    <StyledAvatar>
                        {profile ? getInitials(profile.fullName) : 'U'}
                    </StyledAvatar>
                    <UserDetails>
                        <h1>{profile?.fullName || INFO_MESSAGES.DEFAULT_USER_NAME}</h1>
                        <UserEmail>{profile?.email}</UserEmail>
                        <RegistrationDate>
                            На сайте с {new Date(profile?.createdAt).toLocaleDateString('ru-RU')}
                        </RegistrationDate>
                    </UserDetails>
                </UserInfo>
                <GlassButton 
                    variant="contained" 
                    startIcon={<EditIcon />}
                    color="primary"
                    onClick={onEditProfile}
                >
                    Редактировать
                </GlassButton>
            </HeaderContent>
        </HeaderSection>
    );
};

export default ProfileHeader;
