'use strict';

var React = require('react/addons');
var State = require('react-router').State;

// Export React so the devtools can find it
(window !== window.top ? window.top : window).React = React;

// CSS
require('../../styles/normalize.css');
require('../../styles/main.css');

var FailingDNS = React.createClass({
  render: function() {
      var items = {};
      this.props.results.forEach(function(result) {
        items['result-' + result.Name] = <li>{result.Name}</li>;
      });
      return (
        <div>
            <h3>Failing DNS lookups</h3>
            <ol>
                {items}
            </ol>
        </div>
      );
  }
});

var PassingDNS = React.createClass({
  render: function() {
      var items = {};
      this.props.results.forEach(function(result) {
        items['result-' + result.Name] = <li>{result.Name}</li>;
      });
      return (
        <div>
            <h3>Passing DNS lookups</h3>
        <ol>
            {items}
        </ol>
        </div>
      );
  }
});
/*
var exampleResponse = {
    "Passing":[
        {"Name":"OpenDNS.A","TTL":300},
        {"Name":"OpenDNS.B","TTL":201},
        {"Name":"Google.A","TTL":201},
        {"Name":"Google.B","TTL":294},
        {"Name":"Norton.A","TTL":202},
        {"Name":"Comodo.A","TTL":300},
    ],
    "Failing":[
        {"Name":"OpenDNS.A","TTL":300}
    ],
    "Expected":"178.62.118.87","Type":"a"
};
*/
var CheckApp = React.createClass({
        mixins: [State],
        getInitialState: function() {
        return {
          passing: [],
          failing: []
        };
        },
        lookUpDNS: function() {
            console.log('polling')
            var site = this.getQuery().site;
            var ip = this.getQuery().ip;
            var type = this.getQuery().type;

            $.ajax({
                url: 'http://dns.reactor10.com:7777',
                type: 'get',
                dataType: "json",
                data:{
                    'expected': ip,
                    'type': type,
                    'fqdn': site
                },
                success: function(data) {
                if (this.isMounted()) {
                   this.setState({
                      passing: data.Passing,
                      failing: data.Failing
                    });
                }

                }.bind(this),
                error: function(xhr, status, err) {
                  console.error(this.props.url, status, err.toString());
                }.bind(this)
            });
        },
        componentDidMount: function() {
            // polling code
            this.lookUpDNS();
            setInterval(this.lookUpDNS, 10000);

        },
        render: function() {
            // call could take up to 2secs
            // with upto 28 results
            return (
                <div>
                <PassingDNS results={this.state.passing} />
                <FailingDNS results={this.state.failing} />
                </div>
            );
        }
});


module.exports = CheckApp;
