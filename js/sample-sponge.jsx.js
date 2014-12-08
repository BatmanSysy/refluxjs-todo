var SpongeActions = Reflux.createActions([
  'clearInvites',
  'sendInvites'
]);

var SpongeStore = Reflux.createStore({

  listenables: SpongeActions,

  onClearInvites: function () {
    this.trigger('');
  },

  onSendInvites: function (invitees) {

    console.log('send mail to : [', invitees, '] ');

    this.trigger('', 'Send Invite Success');
  }

});

var SpongeDeepLink = React.createClass({

  propTypes: {
    link: React.PropTypes.string.isRequired
  },

  getImagePath: function(link){
    var imagePath = '../icon-set/???.png';
    if(link == 'windowslive')
      return imagePath.replace('???', 'outlook.com');
    else
      return imagePath.replace('???', link);
  },

  openSpongeModal: function(e){
    e.preventDefault();
    cloudsponge.launch(this.props.link);
  },

  render: function() {
    return (
      <a href='#' onClick={this.openSpongeModal}>
        <img src={this.getImagePath(this.props.link)}></img>
      </a>
    );
  }

});

var MainSponge = React.createClass({

  mixins: [Reflux.ListenerMixin],

  propTypes: {
    domain_key: React.PropTypes.string.isRequired,
    selectionLimit: React.PropTypes.number,
    linkTypes: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
    titleText: React.PropTypes.string
  },

  // cloud-sponge config
  getDefaultProps: function() {
    return {
      domain_key: '38W5VFZBRWAKQLPGXPFL',
      skipSourceMenu: true,
      displaySelectAllNone: false,
      selectionLimit: 5,
      selectionLimitMessage: 'Cannot select more than ??? contacts',
      linkTypes: ['facebook', 'gmail', 'yahoo', 'linkedin',
                  'aol', 'plaxo', 'windowslive'],
      titleText: 'Invite Colleague'
    };
  },

  getInitialState: function() {
    return { emails: '' };
  },

  componentDidMount: function(){

    require(['//api.cloudsponge.com/address_books.js'], function() {

      var options = _.extend(this.props, {
        selectionLimitMessage: this.props.selectionLimitMessage.replace(
          '???', this.props.selectionLimit),
        afterSubmitContacts: this.onImported
      });

      cloudsponge.init(options);

    }.bind(this));

    this.listenTo(SpongeStore, this.onContactChange);
  },

  onImported: function(contacts, source, owner) {

    var emails = contacts.map(function(c){
      return c.email[0] ? c.email[0].address: '{none}' ;
    }).join('; ');

    this.setState({
      emails: emails
    }, function () {
      this.refs.importEmailText.getDOMNode().focus();
    });

  },

  onContactChange: function(emails, alertMessage) {
    this.setState({
      emails: emails
    });

    if(alertMessage)
      alert(alertMessage);
  },

  onCancel: function(e) {
    e.preventDefault();
    SpongeActions.clearInvites();
  },

  onSendInvite: function(e) {
    e.preventDefault();
    SpongeActions.sendInvites(this.state.emails);
  },

  render: function() {

    var classes = React.addons.classSet({
      'disabled': (this.state.emails == ''),
      'btn': true,
      'btn-primary': true
    });

    var spongeLinks = this.props.linkTypes.map(function (links) {
                        return <td style={{paddingRight: 10}}>
                                <SpongeDeepLink link={links} />
                              </td>;
                      });
    return (
      <div className="modal fade" id="inviteColleageModal"
        tabIndex="-1" role="dialog"
        aria-labelledby="myModalLabel"
        aria-hidden="true">
          <div className="modal-dialog modal-sm">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close"
                  data-dismiss="modal"
                  onClick={this.onCancel}>
                  <span aria-hidden="true">&times;</span>
                  <span className="sr-only">Close</span>
                </button>
                <h4 className="modal-title" id="myModalLabel">
                  {this.props.titleText}
                </h4>
              </div>
              <div className="modal-body">
                <div>
                  <table>
                    <tr>
                      {spongeLinks}
                    </tr>
                  </table>
                  <br />
                  <textarea ref='importEmailText'
                    value={this.state.emails}
                    readOnly>
                  </textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-default"
                  data-dismiss="modal"
                  onClick={this.onCancel}>
                    Close
                </button>
                <button type="button" className={classes}
                  onClick={this.onSendInvite}>
                    Send Invite
                </button>
              </div>
            </div>
          </div>
        </div>
    );
  }
});

var InviteColleagueButton = React.createClass({

  propTypes: {
    labelText: React.PropTypes.string
  },

  getDefaultProps: function() {
    return {
      labelText: 'Invite Colleague'
    };
  },

  render: function() {
    return(
      <div>
        <button type="button" className="btn btn-primary"
          data-toggle="modal"
          data-target="#inviteColleageModal">
            {this.props.labelText}
        </button>
        <MainSponge
          selectionLimit={10}
          linkTypes={['facebook', 'gmail', 'yahoo', 'linkedin']}
          titleText={this.props.labelText}>
        </MainSponge>
      </div>
    );
  }

});

// install component in todoapp's element
React.render(<InviteColleagueButton />, document.getElementById('todoapp'));
