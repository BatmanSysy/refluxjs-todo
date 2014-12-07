// cloud-sponge config
var csOptions = {
	domain_key: '38W5VFZBRWAKQLPGXPFL',
	//textarea_id: 'invite_email_list',
	
	// set skipSourceMenu to true when using deep links for a more consistent UX
	skipSourceMenu:true, 
	displaySelectAllNone:false,

	selectionLimit: 5,
	selectionLimitMessage: 'Cannot select more than 5 contacts'
};

var SpongeActions = Reflux.createActions(['ImportContact']);

var SpongeStore = Reflux.createStore({

	listenables: SpongeActions,

    init: function() {
    
    },

    onImportContact: function(link){
        if(cloudsponge){
			cloudsponge.launch(link);
		}
    }

});
	

var SpongeDeepLink = React.createClass({

	componentDidMount: function() {
		
	},

	getImagePath: function(link){
		var imagePath = '';
		
		switch(link){
			case 'facebook': imagePath = '../icon-set/facebook.png'; break;
			case 'gmail': imagePath = '../icon-set/gmail.png'; break;
			case 'yahoo': imagePath = '../icon-set/yahoo.png'; break;
			case 'linkedin': imagePath = '../icon-set/linkedin.png'; break;
		}

		return imagePath;
		
	},

	onImportContact: function(){
		SpongeActions.ImportContact(this.props.link);
	},

	render: function(){

		return (
			<a onClick={this.onImportContact}><img src={this.getImagePath(this.props.link)}></img></a>
			)

	}

});

var MainSponge = React.createClass({

	mixins: [Reflux.ListenerMixin],

	componentDidMount: function(){

		if(cloudsponge){
			var options = _.extend(csOptions || {}, {afterSubmitContacts: this.onImported});

			cloudsponge.init(options);

			//this.listenTo(SpongeStore, this.onImported);
		}
	},

	getInitialState: function() {
		return { emails: '' };
	},

	onImported: function(contacts, source, owner) {

		var emails = contacts.map(function(c){
			return c.email[0] ? c.email[0].address: '{none}' ;
		}).join(',');

		this.setState({
			emails: emails
		}, function () {
			this.refs.emailImport.getDOMNode().focus();
		});
	},

	onTextChange: function(e){

	},

	render: function() {
		return (
			<div>
				<table>
					<tr>
						<td><SpongeDeepLink link='facebook'/></td>
						<td><SpongeDeepLink link='gmail'/></td>
						<td><SpongeDeepLink link='yahoo'/></td>
						<td><SpongeDeepLink link='linkedin'/></td>
					</tr>					
				</table>
				<br />
				<textarea ref='emailImport' className='EmailImport' value={this.state.emails} onChange={this.onTextChange}></textarea>
			</div>
			);
	}

});

React.render(<MainSponge />, document.getElementById('todoapp'));