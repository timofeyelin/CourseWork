import { 
    Section, 
    SectionTitle, 
    AboutText 
} from '../Landing.styles';

const About = () => {
    return (
        <Section id="about">
            <SectionTitle variant="h4" component="h2">
                О нас
            </SectionTitle>
            <AboutText variant="body1" paragraph align="center">
                Мы объединяем жителей и управляющую компанию, делая взаимодействие прозрачным и удобным.
                Наша цель — создать комфортную среду для жизни, где все бытовые вопросы решаются в несколько кликов.
            </AboutText>
        </Section>
    );
};

export default About;
