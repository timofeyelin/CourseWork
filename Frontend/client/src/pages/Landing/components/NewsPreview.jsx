import { Typography } from '@mui/material';
import { 
    Section, 
    SectionTitle, 
    NewsGrid, 
    NewsCard, 
    NewsDate, 
    NewsContent,
    NoNewsText
} from '../Landing.styles';

const NewsPreview = ({ news }) => {
    return (
        <Section id="news">
            <SectionTitle variant="h4" component="h2">
                Новости и объявления
            </SectionTitle>
            <NewsGrid>
                {news.length > 0 ? (
                    news.map((item) => (
                        <NewsCard key={item.announcementId}>
                            <NewsDate variant="caption" color="primary">
                                {new Date(item.createdAt).toLocaleDateString('ru-RU', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                })}
                            </NewsDate>
                            <Typography variant="h6" gutterBottom fontWeight="bold">
                                {item.title}
                            </Typography>
                            <NewsContent variant="body2" color="textSecondary">
                                {item.content}
                            </NewsContent>
                        </NewsCard>
                    ))
                ) : (
                    <NoNewsText variant="body1" color="textSecondary" align="center">
                        Пока нет новостей
                    </NoNewsText>
                )}
            </NewsGrid>
        </Section>
    );
};

export default NewsPreview;
