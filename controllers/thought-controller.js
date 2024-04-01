const { Thought, User } = require('../models');

const ThoughtManager = {
    fetchAllThoughts(request, response) {
        Thought.find({})
            .populate('reactions', '-__v')
            .select('-__v')
            .then(thoughtData => response.json(thoughtData)) 
            .catch(error => {
                console.error(error);
                response.status(400).send();
            });
    },
    findThoughtById({ params }, response) {
        Thought.findById(params.id)
            .populate('reactions', '-__v')
            .select('-__v')
            .then(thoughtData => {
                if (!thoughtData) {
                    response.status(404).json({ message: 'Thought not found' });
                    return;
                }
                response.json(thoughtData);
            })
            .catch(error => {
                console.error(error);
                response.status(400).send();
            });
    },
    createThought({ params, body }, response) {
        Thought.create(body)
            .then(({ _id }) => User.findByIdAndUpdate(
                params.userId,
                { $addToSet: { thoughts: _id } },
            ))
            .then(thoughtData => response.json(thoughtData)) 
            .catch(error => response.status(400).json(error));
    },
    editThought({ params, body }, response) {
        Thought.findByIdAndUpdate(params.id, body, { new: true, runValidators: true })
            .then(thoughtData => {
                if (!thoughtData) {
                    response.status(404).json({ message: 'No matching thought found' });
                    return;
                }
                response.json(thoughtData);
            })
            .catch(error => response.status(400).json(error));
    },
    appendReaction({ params, body }, response) {
        Thought.findByIdAndUpdate(
            params.thoughtId,
            { $push: { reactions: body } },
            { new: true, runValidators: true }
        )
        .populate('reactions', '-__v')
        .select('-__v')
            .then(thoughtData => {
                if (!thoughtData) {
                    response.status(404).json({ message: 'Thought ID not found' });
                    return;
                }
                response.json(thoughtData);
            })
            .catch(error => response.status(400).json(error));
    },
deleteThought({ params }, response) {
    Thought.findOneAndDelete({ _id: params.id })
        .then(deletedThought => {
            if (!deletedThought) {
                response.status(404).json({ message: 'Thought ID not found' });
                return;
            }
            response.json({ message: 'Thought successfully deleted' });
        })
        .catch(error => response.status(400).json(error));
},

    detachReaction({ params }, response) {
        Thought.findByIdAndUpdate(
            params.thoughtId,
            { $pull: { reactions: { _id: params.reactionId } } }, 
            { new: true }
        )
            .then(thoughtData => {
                if (!thoughtData) {
                    response.status(404).json({ message: 'No matching thought for reaction removal' }); // Thought not found handler.
                    return;
                }
                response.json(thoughtData); 
            })
            .catch(error => response.status(400).json(error));
    }
};


module.exports = ThoughtManager;