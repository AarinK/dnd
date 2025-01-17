// DragAndDrop.js
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import styled from 'styled-components';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

const copy = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const item = sourceClone[droppableSource.index];

    destClone.splice(droppableDestination.index, 0, { ...item, id: uuidv4() });
    return destClone;
};

const move = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return result;
};

const Content = styled.div`
    margin-right: 200px;
`;

const Item = styled.div`
    display: flex;
    user-select: none;
    padding: 0.5rem;
    margin: 0 0 0.5rem 0;
    align-items: flex-start;
    align-content: flex-start;
    line-height: 1.5;
    border-radius: 3px;
    background: #fff;
    border: 1px ${props => (props.isDragging ? 'dashed #4099ff' : 'solid #ddd')};
`;

const Clone = styled(Item)`
    + div {
        display: none !important;
    }
`;

const Handle = styled.div`
    display: flex;
    align-items: center;
    align-content: center;
    user-select: none;
    margin: -0.5rem 0.5rem -0.5rem -0.5rem;
    padding: 0.5rem;
    line-height: 1.5;
    border-radius: 3px 0 0 3px;
    background: #fff;
    border-right: 1px solid #ddd;
    color: #000;
`;

const List = styled.div`
    border: 1px
        ${props => (props.isDraggingOver ? 'dashed #000' : 'solid #ddd')};
    background: #fff;
    padding: 0.5rem 0.5rem 0;
    border-radius: 3px;
    flex: 0 0 150px;
    font-family: sans-serif;
`;

const Kiosk = styled(List)`
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 200px;
`;

const Container = styled(List)`
    margin: 0.5rem 0.5rem 1.5rem;
    background: #ccc;
`;

const Notice = styled.div`
    display: flex;
    align-items: center;
    align-content: center;
    justify-content: center;
    padding: 0.5rem;
    margin: 0 0.5rem 0.5rem;
    border: 1px solid transparent;
    line-height: 1.5;
    color: #aaa;
`;

const Button = styled.button`
    display: flex;
    align-items: center;
    align-content: center;
    justify-content: center;
    margin: 0.5rem;
    padding: 0.5rem;
    color: #000;
    border: 1px solid #ddd;
    background: #fff;
    border-radius: 3px;
    font-size: 1rem;
    cursor: pointer;
`;

const ButtonText = styled.div`
    margin: 0 1rem;
`;

const ITEMS = [
    {
        id: uuidv4(),
        content: 'Headline'
    },
    {
        id: uuidv4(),
        content: 'Copy'
    },
    {
        id: uuidv4(),
        content: 'Image'
    },
    {
        id: uuidv4(),
        content: 'Slideshow'
    },
    {
        id: uuidv4(),
        content: 'Quote'
    }
];

const DragAndDrop = () => {
    const [state, setState] = useState({ [uuidv4()]: [] });

    const onDragEnd = result => {
        const { source, destination } = result;

        if (!destination) {
            return;
        }

        switch (source.droppableId) {
            case destination.droppableId:
                setState({
                    ...state,
                    [destination.droppableId]: reorder(
                        state[source.droppableId],
                        source.index,
                        destination.index
                    )
                });
                break;
            case 'ITEMS':
                setState({
                    ...state,
                    [destination.droppableId]: copy(
                        ITEMS,
                        state[destination.droppableId],
                        source,
                        destination
                    )
                });
                break;
            default:
                setState(
                    move(
                        state[source.droppableId],
                        state[destination.droppableId],
                        source,
                        destination
                    )
                );
                break;
        }
    };

    const addList = () => {
        setState({ ...state, [uuidv4()]: [] });
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="ITEMS" isDropDisabled={true}>
                {(provided, snapshot) => (
                    <Kiosk
                        ref={provided.innerRef}
                        isDraggingOver={snapshot.isDraggingOver}>
                        {ITEMS.map((item, index) => (
                            <Draggable
                                key={item.id}
                                draggableId={item.id}
                                index={index}>
                                {(provided, snapshot) => (
                                    <>
                                        <Item
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            isDragging={snapshot.isDragging}
                                            style={provided.draggableProps.style}>
                                            {item.content}
                                        </Item>
                                        {snapshot.isDragging && (
                                            <Clone>{item.content}</Clone>
                                        )}
                                    </>
                                )}
                            </Draggable>
                        ))}
                    </Kiosk>
                )}
            </Droppable>
            <Content>
                <Button onClick={addList}>
                    <svg width="24" height="24" viewBox="0 0 24 24">
                        <path
                            fill="currentColor"
                            d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"
                        />
                    </svg>
                    <ButtonText>Add List</ButtonText>
                </Button>
                {Object.keys(state).map((list, i) => (
                    <Droppable key={list} droppableId={list}>
                        {(provided, snapshot) => (
                            <Container
                                ref={provided.innerRef}
                                isDraggingOver={snapshot.isDraggingOver}>
                                {state[list].length ? (
                                    state[list].map((item, index) => (
                                        <Draggable
                                            key={item.id}
                                            draggableId={item.id}
                                            index={index}>
                                            {(provided, snapshot) => (
                                                <Item
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    isDragging={snapshot.isDragging}
                                                    style={provided.draggableProps.style}>
                                                    <Handle {...provided.dragHandleProps}>
                                                        <svg width="24" height="24" viewBox="0 0 24 24">
                                                            <path
                                                                fill="currentColor"
                                                                d="M3,15H21V13H3V15M3,19H21V17H3V19M3,11H21V9H3V11M3,5V7H21V5H3Z"
                                                            />
                                                        </svg>
                                                    </Handle>
                                                    {item.content}
                                                </Item>
                                            )}
                                        </Draggable>
                                    ))
                                ) : (
                                    !provided.placeholder && <Notice>Drop items here</Notice>
                                )}
                                {provided.placeholder}
                            </Container>
                        )}
                    </Droppable>
                ))}
            </Content>
        </DragDropContext>
    );
};

export default DragAndDrop;
