import { Typography, Chip, Box } from '@mui/material'; 
import { 
    Section, 
    SectionTitle, 
    NewsGrid, 
    NewsCard, 
    NewsDate, 
    NewsContent,
    NoNewsText
} from '../Landing.styles';
import { ANNOUNCEMENT_TYPES } from '../../../utils/constants'; 

const NewsPreview = ({ news }) => {

    // Хелпер для выбора чипа
    const getTypeChip = (type) => {
        if (type === ANNOUNCEMENT_TYPES.EMERGENCY) {
            return <Chip label="Авария" color="error" size="small" sx={{ height: 24, fontSize: '0.75rem', fontWeight: 600 }} />;
        }
        if (type === ANNOUNCEMENT_TYPES.OUTAGE) {
            return <Chip label="Отключение" color="warning" size="small" sx={{ height: 24, fontSize: '0.75rem', fontWeight: 600 }} />;
        }
        return null; 
    };

    return (
        <Section id="news">
            <SectionTitle variant="h4" component="h2">
                Новости и объявления
            </SectionTitle>
            <NewsGrid>
                {news.length > 0 ? (
                    news.map((item) => (
                        <NewsCard key={item.announcementId}>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                <NewsDate variant="caption" color="primary" sx={{ mb: 0 }}>
                                    {new Date(item.createdAt).toLocaleDateString('ru-RU', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                    })}
                                </NewsDate>
                                {getTypeChip(item.type)}
                            </Box>

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