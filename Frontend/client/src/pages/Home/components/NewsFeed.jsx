import { Notifications, ArrowForward } from '@mui/icons-material';
import { ERROR_MESSAGES } from '../../../utils/constants';
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
        <>
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
                                    {!news.isRead && <NewBadge>Новое</NewBadge>}
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
        </>
    );
};

export default NewsFeed;
