import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { v4 as uuid } from 'uuid';
import IssueCard from './IssueCard';

const Columns = ({ issues }) => {
    const backlogIssues = issues.filter(issue => issue.status === 'BACKLOG');
    const selForDevIssues = issues.filter(issue => issue.status === 'SELECTED FOR DEVELOPMENT');
    const inProgressIssues = issues.filter(issue => issue.status === 'IN PROGRESS');
    const doneIssues = issues.filter(issue => issue.status === 'DONE');

    const issuesColumns = {
        [uuid()]: {
            name: 'BACKLOG',
            items: backlogIssues
        },
        [uuid()]: {
            name: 'SELECTED FOR DEVELOPMENT',
            items: selForDevIssues
        },
        [uuid()]: {
            name: 'IN PROGRESS',
            items: inProgressIssues
        },
        [uuid()]: {
            name: 'DONE',
            items: doneIssues
        },
    };

    const [columns, setColumns] = useState(issuesColumns);
    useEffect(() => { setColumns(issuesColumns) }, [issues]);

    const onDragEnd = (result, columns, setColumns) => {
        if (!result.destination) return;
        const { source, destination } = result;

        if (source.droppableId !== destination.droppableId) {
            // Issue was dragged and dropped to different column.
            const sourceColumn = columns[source.droppableId];
            const destColumn = columns[destination.droppableId];
            const sourceItems = [...sourceColumn.items];
            const destItems = [...destColumn.items];
            const [removed] = sourceItems.splice(source.index, 1);
            destItems.splice(destination.index, 0, removed);
            setColumns({
                ...columns,
                [source.droppableId]: {
                    ...sourceColumn,
                    items: sourceItems
                },
                [destination.droppableId]: {
                    ...destColumn,
                    items: destItems
                }
            });
        } else {
            // Issue was dragged and dropped within same column.
            const column = columns[source.droppableId];
            const copiedItems = [...column.items];
            const [removed] = copiedItems.splice(source.index, 1);
            copiedItems.splice(destination.index, 0, removed);
            setColumns({
                ...columns,
                [source.droppableId]: {
                    ...column,
                    items: copiedItems
                }
            });
        }
    };

    return (
        <DragDropContext onDragEnd={result => onDragEnd(result, columns, setColumns)}>
            <div id='columns-container'>
                {
                    Object.entries(columns).map(([columnId, column], index) => {
                        return (
                            <div className='single-column' key={columnId}>
                                <p>{column.name} {column.items.length}</p>
                                <Droppable key={columnId} droppableId={columnId}>
                                    {(provided, snapshot) => {
                                        return (
                                            <div
                                                className='issue-cards-container'
                                                {...provided.droppableProps}
                                                ref={provided.innerRef}
                                            >
                                                {column.items.map((item, index) => {
                                                    return (
                                                        <Draggable
                                                            key={item.issue_id.toString()}
                                                            draggableId={item.issue_id.toString()}
                                                            index={index}
                                                        >
                                                            {(provided, snapshot) => {
                                                                return (
                                                                    <div
                                                                        ref={provided.innerRef}
                                                                        {...provided.draggableProps}
                                                                        {...provided.dragHandleProps}
                                                                    >
                                                                        <IssueCard
                                                                            issue={item}
                                                                        />
                                                                    </div>
                                                                );
                                                            }}
                                                        </Draggable>
                                                    );
                                                })}
                                                {provided.placeholder}
                                            </div>
                                        );
                                    }}
                                </Droppable>
                            </div>
                        );
                    })
                }
            </div>
        </DragDropContext>
    );
};

export default Columns;