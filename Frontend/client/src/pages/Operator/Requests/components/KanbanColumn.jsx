import { Droppable } from '@hello-pangea/dnd';
import { Typography, Chip } from '@mui/material';
import { ColumnContainer, ColumnHeader, TaskList } from '../OperatorRequests.styles';
import RequestCard from './RequestCard';

const KanbanColumn = ({ title, statusId, requests, color, onCardClick }) => {
    return (
        <ColumnContainer>
            <ColumnHeader color={color}>
                <Typography variant="subtitle1">{title}</Typography>
                <Chip 
                    label={requests.length} 
                    size="small" 
                    sx={{ fontWeight: 'bold', backgroundColor: 'rgba(0,0,0,0.05)' }} 
                />
            </ColumnHeader>
            
            <Droppable droppableId={statusId.toString()}>
                {(provided, snapshot) => (
                    <TaskList
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        $isDraggingOver={snapshot.isDraggingOver}
                    >
                        {requests.map((request, index) => (
                            <RequestCard 
                                key={request.requestId} 
                                request={request} 
                                index={index} 
                                onClick={onCardClick}
                            />
                        ))}
                        {provided.placeholder}
                    </TaskList>
                )}
            </Droppable>
        </ColumnContainer>
    );
};

export default KanbanColumn;