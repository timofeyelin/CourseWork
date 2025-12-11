import { 
    HeroSection, 
    HeroContainer, 
    HeroContent, 
    HeroTitle, 
    HeroSubtitle, 
    HeroList, 
    HeroListItem, 
    HeroButtons, 
    StyledAuthButton, 
    LoginButton, 
    HeroImageContainer 
} from '../Landing.styles';

const Hero = ({ openLogin, openRegister }) => {
    return (
        <HeroSection>
            <HeroContainer>
                <HeroContent>
                    <HeroTitle variant="h1">
                        Горизонт онлайн
                    </HeroTitle>
                    <HeroSubtitle variant="h5">
                        Современный онлайн‑сервис для управления домом и оплаты ЖКХ.
                    </HeroSubtitle>
                    <HeroList>
                        <HeroListItem>Оплачивайте счета без очередей и бумажек</HeroListItem>
                        <HeroListItem>Передавайте показания за пару кликов</HeroListItem>
                        <HeroListItem>Будьте в курсе объявлений и новостей дома</HeroListItem>
                    </HeroList>
                    <HeroButtons>
                        <StyledAuthButton
                            variant="contained"
                            color="primary"
                            size="large"
                            onClick={openRegister}
                        >
                            Начать пользоваться
                        </StyledAuthButton>
                        <LoginButton
                            variant="text"
                            color="primary"
                            size="large"
                            onClick={openLogin}
                        >
                            Войти
                        </LoginButton>
                    </HeroButtons>
                </HeroContent>
                <HeroImageContainer>
                    <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="Modern House" />
                </HeroImageContainer>
            </HeroContainer>
        </HeroSection>
    );
};

export default Hero;
