import { Chip } from '@mui/material'; // Добавили Chip
import { Notifications, ArrowForward } from '@mui/icons-material';
import { ERROR_MESSAGES, ANNOUNCEMENT_TYPES } from '../../../utils/constants'; // Добавили константы
import { 
    NewsSectionHeader, 
    NewsSectionTitle, 
    StyledAlert, 
    NewsSection, 
    NewsCard, 
    NewsActionArea, 
    NewsHeader, 
    NewsTitleWrapper, 
    NewsTitle, 
    NewBadge, 
    NewsDate, 
    NewsContent, 
    ReadMoreLink, 
    ReadMoreIcon 
} from '../Home.styles';

const NewsFeed = ({ announcements, newsError, onOpenNews }) => {
    return (
        <div id="news">
            <NewsSectionHeader>
                <Notifications color="primary" />
                <NewsSectionTitle variant="h5">
                    Новости и объявления
                </NewsSectionTitle>
            </NewsSectionHeader>

            {newsError && (
                <StyledAlert severity="error">
                    {ERROR_MESSAGES.NEWS_LOAD_FAILED}
                </StyledAlert>
            )}

            {!newsError && announcements.length === 0 && (
                <StyledAlert severity="info">
                    Новостей пока нет.
                </StyledAlert>
            )}

            <NewsSection>
                {announcements.map(news => (
                    <NewsCard key={news.announcementId}>
                        <NewsActionArea onClick={() => onOpenNews(news)}>
                            <NewsHeader>
                                <NewsTitleWrapper>
                                    <NewsTitle>{news.title}</NewsTitle>
                                    
                                    {/* Бейдж "Новое" */}
                                    {!news.isRead && <NewBadge>Новое</NewBadge>}
                                    
                                    {/* Бейджи типов */}
                                    {news.type === ANNOUNCEMENT_TYPES.EMERGENCY && (
                                        <Chip 
                                            label="Авария" 
                                            color="error" 
                                            size="small" 
                                            sx={{ ml: 1, height: 20, fontSize: '0.7rem', fontWeight: 600 }} 
                                        />
                                    )}
                                    {news.type === ANNOUNCEMENT_TYPES.OUTAGE && (
                                        <Chip 
                                            label="Отключение" 
                                            color="warning" 
                                            size="small" 
                                            sx={{ ml: 1, height: 20, fontSize: '0.7rem', fontWeight: 600 }} 
                                        />
                                    )}
                                </NewsTitleWrapper>
                                
                                <NewsDate>
                                    {new Date(news.createdAt).toLocaleDateString('ru-RU')}
                                </NewsDate>
                            </NewsHeader>
                            <NewsContent>
                                {news.content}
                            </NewsContent>
                            <ReadMoreLink>
                                Читать полностью 
                                <ReadMoreIcon>
                                    <ArrowForward fontSize="inherit" />
                                </ReadMoreIcon>
                            </ReadMoreLink>
                        </NewsActionArea>
                    </NewsCard>
                ))}
            </NewsSection>
        </div>
    );
};

export default NewsFeed;