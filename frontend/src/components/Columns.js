import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { v4 as uuid } from 'uuid';
import IssueCard from './IssueCard';

// Temporary data. Will be fetched from server.
const backlogIssues = [
    {
        title: 'Implement client API for fetching issue data.',
        id: uuid(),
        type: 'BUG',
        prio: 'HIGHEST',
    },
    {
        title: 'Research Intel vs M1.',
        id: uuid(),
        type: 'TASK',
        prio: 'MEDIUM',
    }
];
const selForDevIssues = [
    {
        title: 'Filtered issue search.',
        id: uuid(),
        type: 'BUG',
        prio: 'LOW',
    }
];
const inProgressIssues = [
    {
        title: 'Kanban drag-n-drop functionality.',
        id: uuid(),
        type: 'STORY',
        prio: 'LOWEST',
    }
];
const doneIssues = [
    {
        title: 'Implement Server API.',
        id: uuid(),
        type: 'TASK',
        prio: 'MEDIUM',
    },
    {
        title: 'Setup postgresql database.',
        id: uuid(),
        type: 'STORY',
        prio: 'HIGHEST',
    },
    {
        title: 'Refill water bottle.',
        id: uuid(),
        type: 'BUG',
        prio: 'LOWEST',
    }
];

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

const Columns = () => {
    const [columns, setColumns] = useState(issuesColumns);
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
                                                            key={item.id}
                                                            draggableId={item.id}
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
                                                                            title={item.title}
                                                                            type={item.type}
                                                                            prio={item.prio}
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