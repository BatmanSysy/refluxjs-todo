var Members = [{
	id: 1,
	name: 'Batman',
	desc: 'I\'m Batman',
	isAdmin: true
}, {
	id: 2,
	name: 'J-Orn',
	desc: 'J\' Orn Joob Joob',
	isAdmin: false
},{
	id: 3,
	name: 'Mama',
	desc: 'Mama\' Joof Joof',
	isAdmin: false
}];

var MemberActions = Reflux.createActions([
	'Added',
	'Updated',
	'Deleted'
	]);

// Creates a DataStore
var MemberStore = Reflux.createStore({
	
	listenables: MemberActions,

	// Initial setup
	init: function() {

	},

    // Callback
    onAdded: function(member){
    	if(member){
    		var result = 'Add ' + member.name + ' to Store';

    		this.trigger(result);
    	}
    },

	// Callback
	onUpdated: function(member){
		if(member){
			var result = 'Update ' + member.name + ' to Store';

			this.trigger(result);
		}
	},

 	// Callback
 	onDeleted: function(member){
 		if(member){
 			var result = 'Delete ' + member.name + ' from Store';

 			this.trigger(result);
 		}
 	}

 });

var MemberItem = React.createClass({

	mixins: [Reflux.ListenerMixin],

	componentDidMount: function() {
		this.listenTo(MemberStore, this.onMemberChange);
	},

	onMemberChange: function(result) {
		console.log('apply from component: ', result);
	},

	addMember: function(e) {
		e.preventDefault();

		// console.log('click add member');
		MemberActions.Added(this.props.member);
	},

	updateMember: function(e) {
		e.preventDefault();

		// console.log('click add member');
		MemberActions.Updated(this.props.member);
	},

	deleteMember: function(e) {
		e.preventDefault();

		// console.log('click add member');
		MemberActions.Deleted(this.props.member);
	},

	render: function() {
		return(
			<tr>
			<td>{this.props.member.id}</td>
			<td>{this.props.member.name}</td>
			<td>{this.props.member.desc}</td>
			<td>{this.props.member.isAdmin? 'Admin': 'User'}</td>
			<td>
			<button className='btn btn-primary' onClick={this.addMember}>Add</button>&nbsp;
			<button className='btn btn-success' onClick={this.updateMember}>Update</button>&nbsp;
			<button className='btn btn-danger' onClick={this.deleteMember}>Delete</button>&nbsp;
			</td>
			</tr>
			);
	}

});

var MemberList = React.createClass({

	getInitialState: function() {
		return {
			members: []
		};
	},

	render: function(){
		return(
			<div> 
			<table className='table table-striped'>
			<thead>
			<tr><td>id</td><td>name</td><td>desc</td><td>role</td><td> actions </td></tr>
			</thead>
			<tbody>
			{this.props.members.map(function(member) {
				return(<MemberItem member={member} />);
			})}
			</tbody>
			</table></div>
			);
	}
});


React.render(<MemberList members={this.Members} />, document.getElementById('todoapp'));