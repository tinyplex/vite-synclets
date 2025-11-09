import './index.css';
import {createSynclet} from 'synclets';
import {createMemoryDataConnector} from 'synclets/connector/memory';
import {createMemoryMetaConnector} from 'synclets/connector/memory';
import {createMemoryTransport} from 'synclets/transport/memory';

// Convenience function for getting an element by Id
const getElementById = (id) => document.getElementById(id);

// Convenience function for attaching an action to a button
const onClick = (id, onClick) =>
  getElementById(id).addEventListener('click', onClick);

// Convenience function for writing out pretty JSON into an element
const updateJson = (id, content) =>
  (getElementById(id).innerText = JSON.stringify(content, null, 2));

// Convenience function for generating a random integer
const getRandom = (max = 100) => Math.floor(Math.random() * max);

addEventListener('load', async () => {
  const synclet1 = await createSynclet(
    {
      dataConnector: createMemoryDataConnector(1),
      metaConnector: createMemoryMetaConnector(1),
      transport: createMemoryTransport(),
    },
    {
      onSetAtom: async () => {
        updateJson('data1', await synclet1.getData());
        updateJson('meta1', await synclet1.getMeta());
      },
    },
    {id: 'synclet1', logger: console},
  );
  await synclet1.start();

  const synclet2 = await createSynclet(
    {
      dataConnector: createMemoryDataConnector(1),
      metaConnector: createMemoryMetaConnector(1),
      transport: createMemoryTransport(),
    },
    {
      onSetAtom: async () => {
        updateJson('data2', await synclet2.getData());
        updateJson('meta2', await synclet2.getMeta());
      },
    },
    {id: 'synclet2', logger: console},
  );
  await synclet2.start();

  onClick(
    'random1',
    async () => await synclet1.setAtom(['random'], getRandom()),
  );

  onClick('toggle1', async () => {
    if (synclet1.isStarted()) {
      await synclet1.stop();
      getElementById('toggle1').innerText = '▶';
    } else {
      await synclet1.start();
      getElementById('toggle1').innerText = '⏸';
    }
  });

  onClick(
    'random2',
    async () => await synclet2.setAtom(['random'], getRandom()),
  );

  onClick('toggle2', async () => {
    if (synclet2.isStarted()) {
      await synclet2.stop();
      getElementById('toggle2').innerText = '▶';
    } else {
      await synclet2.start();
      getElementById('toggle2').innerText = '⏸';
    }
  });
});
