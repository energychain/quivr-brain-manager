# quivr-brain-manager
Node Module to work with knowledge/brains in Quivr.

## Motiviation
During AI enginerring we required a method to simply re-creation of a knowledge-space based on a set of URLs. 

## Usage

### Add URL to default Brain
```Javascript
const Manager = require("quivr-brain-manager");

const config = {
    quivr_api_key:'<INSERT_YOUR_KEY_HERE>'
};

const manager = new Manager(config);

const app = async function() {
    console.log(await manager.crawl('Default brain','https://corrently.energy/'));
};

app();
```

### Add URL to on premise installation and custom brain
```Javascript
const Manager = require("quivr-brain-manager");

const config = {
    quivr_api_key:'<INSERT_YOUR_KEY_HERE>',
    quivr_url:'https://yourInstallation.host.com'
};

const manager = new Manager(config);

const app = async function() {
    console.log(await manager.crawl('TestBrain','https://corrently.energy/'));
};

app();
```

Change TestBrain to the name or ID of your brain.

## Maintainer / Imprint

<addr>
STROMDAO GmbH  <br/>
Gerhard Weiser Ring 29  <br/>
69256 Mauer  <br/>
Germany  <br/>
  <br/>
+49 6226 968 009 0  <br/>
  <br/>
kontakt@stromdao.com  <br/>
  <br/>
Handelsregister: HRB 728691 (Amtsgericht Mannheim)
</addr>


## LICENSE
[Apache-2.0](LICENSE)