import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../useAuth';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { v4 as uuid } from 'uuid';
import IssueCard from './IssueCard';
import { updateIssue } from '../api/UserAPI';

const Columns = ({ issues }) => {
    const auth = useAuth();
    const navigate = useNavigate();

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
    useEffect(() => { setColumns(issuesColumns) },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [issues]);

    const onDragEnd = (result, columns, setColumns) => {
        // Logic below places the issue card in the dropped column.
        // It also updates the issue's status according to the column.

        if (!result.destination) return;
        const { source, destination } = result;

        if (source.droppableId !== destination.droppableId) {
            // Issue was dragged and dropped to different column.
            const sourceColumn = columns[source.droppableId];
            const destColumn = columns[destination.droppableId];

            // Update to new status.
            const sourceItems = [...sourceColumn.items];
            const destItems = [...destColumn.items];
            const [removed] = sourceItems.splice(source.index, 1);

            doUpdate(removed.issue_id, {status: destColumn.name});
            removed.status = destColumn.name;

            // Insert to new column.
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
    const doUpdate = async (issueId, data) => {
        try {
            await updateIssue(issueId, data);
        } catch (error) {
            if (error.response.status === 401) {
                await auth.unauthorizedLogout(() => {
                  navigate('/');
                });
            }
        }
    };
    const processStatusUpdate = (issueId, oldStatus, newStatus) => {
        // This function serves to move the issue card to the corresponding column
        // when there is a change in status via the modal.

        // Steps:
        //   1. Find issue entry in columns (i.e., source location).
        //   1. Remove entry from source column.
        //   1. Update the entry status (e.g., BACKLOG, IN PROGRESS, ETC.).
        //   1. Find destination column.
        //   1. Place entry in destination column and update state.
        let srcDroppableId, srcCol, dstDroppableId, dstCol;
        for (const [key, value] of Object.entries(columns)) {
            if (value.name === oldStatus) {
                srcDroppableId = key;
                srcCol = value;
            }
            if (value.name === newStatus) {
                dstDroppableId = key;
                dstCol = value;
            }
        }

        const srcIdx = srcCol.items.findIndex(i => i.issue_id === issueId);
        const dstIdx = dstCol.items.length; // place issue card at end of column

        // Update to new status.
        const sourceItems = [...srcCol.items];
        const destItems = [...dstCol.items];
        const [removed] = sourceItems.splice(srcIdx, 1);

        removed.status = dstCol.name;

        // Insert to new column.
        destItems.splice(dstIdx, 0, removed);
        setColumns({
            ...columns,
            [srcDroppableId]: {
                ...srcCol,
                items: sourceItems
            },
            [dstDroppableId]: {
                ...dstCol,
                items: destItems
            }
        });
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
                                                                            onStatusUpdate={processStatusUpdate}
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