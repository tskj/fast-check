import { BasicPool, PoolToWorkerMessage, WorkerToPoolMessage } from '../../../src/internals/worker-pool/BasicPool.js';
import * as WorkerThreadsMock from 'node:worker_threads';

describe('BasicPool', () => {
  it('should instantly register handlers when spawning workers', () => {
    // Arrange
    const { Worker, on, postMessage } = mockWorker();
    const workerFileUrl = new URL('file:///worker.cjs');
    const workerId = 0;
    const pool = new BasicPool(workerFileUrl, workerId);

    // Act
    pool.spawnNewWorker();

    // Assert
    expect(Worker).toHaveBeenCalledTimes(1);
    expect(Worker).toHaveBeenCalledWith(workerFileUrl, { workerData: { currentWorkerId: workerId } });
    expect(on).toHaveBeenCalled();
    expect(postMessage).not.toHaveBeenCalled();
  });

  describe('ready worker', () => {
    it('should spawn workers marked as available and not faulty', async () => {
      // Arrange
      const { on } = mockWorker();
      const workerFileUrl = new URL('file:///worker.cjs');
      const workerId = 0;
      const pool = new BasicPool(workerFileUrl, workerId);

      // Act
      const workerPromise = pool.spawnNewWorker();
      fireOnlineEvent(on);
      const worker = await workerPromise;

      // Assert
      expect(worker.isAvailable()).toBe(true);
      expect(worker.isFaulty()).toBe(false);
    });

    it('should mark the worker as not available but not faulty while waiting answers', async () => {
      // Arrange
      const { on, postMessage } = mockWorker();
      const workerFileUrl = new URL('file:///worker.cjs');
      const workerId = 0;
      const onSuccess = jest.fn();
      const onFailure = jest.fn();
      const pool = new BasicPool<string, string>(workerFileUrl, workerId);
      const workerPromise = pool.spawnNewWorker();
      fireOnlineEvent(on);
      const worker = await workerPromise;

      // Act
      worker.register('to-worker', onSuccess, onFailure);

      // Assert
      expect(worker.isAvailable()).toBe(false);
      expect(worker.isFaulty()).toBe(false);
      expect(postMessage).toHaveBeenCalledTimes(1);
      expect(onSuccess).not.toHaveBeenCalled();
      expect(onFailure).not.toHaveBeenCalled();
    });

    it('should call success handler and release the worker as soon as receiving a successful answer', async () => {
      // Arrange
      const { on, postMessage } = mockWorker();
      const workerFileUrl = new URL('file:///worker.cjs');
      const workerId = 0;
      const onSuccess = jest.fn();
      const onFailure = jest.fn();
      const successMessage = 'success!';
      const pool = new BasicPool<string, string>(workerFileUrl, workerId);
      const workerPromise = pool.spawnNewWorker();
      fireOnlineEvent(on);
      const worker = await workerPromise;
      worker.register('to-worker', onSuccess, onFailure);

      // Act
      const receivedMessage: PoolToWorkerMessage<string> = postMessage.mock.calls[0][0];
      const receivedRunId = receivedMessage.runId;
      const message: WorkerToPoolMessage<string> = { runId: receivedRunId, success: true, output: successMessage };
      const onMessageHandler = on.mock.calls.find(([eventName]) => eventName === 'message')![1];
      onMessageHandler(message); // emulate success

      // Assert
      expect(onSuccess).toHaveBeenCalledTimes(1);
      expect(onSuccess).toHaveBeenCalledWith(successMessage);
      expect(worker.isAvailable()).toBe(true);
      expect(worker.isFaulty()).toBe(false);
      expect(postMessage).toHaveBeenCalledTimes(1);
      expect(onFailure).not.toHaveBeenCalled();
    });

    it('should call failure handler and release the worker as soon as receiving a failed answer', async () => {
      // Arrange
      const { on, postMessage } = mockWorker();
      const workerFileUrl = new URL('file:///worker.cjs');
      const workerId = 0;
      const onSuccess = jest.fn();
      const onFailure = jest.fn();
      const errorMessage = 'oups there was an error!';
      const pool = new BasicPool<string, string>(workerFileUrl, workerId);
      const workerPromise = pool.spawnNewWorker();
      fireOnlineEvent(on);
      const worker = await workerPromise;
      worker.register('to-worker', onSuccess, onFailure);

      // Act
      const receivedMessage: PoolToWorkerMessage<string> = postMessage.mock.calls[0][0];
      const receivedRunId = receivedMessage.runId;
      const message: WorkerToPoolMessage<string> = { runId: receivedRunId, success: false, error: errorMessage };
      const onMessageHandler = on.mock.calls.find(([eventName]) => eventName === 'message')![1];
      onMessageHandler(message); // emulate failure

      // Assert
      expect(onFailure).toHaveBeenCalledTimes(1);
      expect(onFailure).toHaveBeenCalledWith(errorMessage);
      expect(worker.isAvailable()).toBe(true);
      expect(worker.isFaulty()).toBe(false);
      expect(postMessage).toHaveBeenCalledTimes(1);
      expect(onSuccess).not.toHaveBeenCalled();
    });

    it('should ignore success or failures not related to the current run', async () => {
      // Arrange
      const { on, postMessage } = mockWorker();
      const workerFileUrl = new URL('file:///worker.cjs');
      const workerId = 0;
      const onSuccess = jest.fn();
      const onFailure = jest.fn();
      const pool = new BasicPool<string, string>(workerFileUrl, workerId);
      const workerPromise = pool.spawnNewWorker();
      fireOnlineEvent(on);
      const worker = await workerPromise;
      worker.register('to-worker', onSuccess, onFailure);

      // Act
      const receivedMessage: PoolToWorkerMessage<string> = postMessage.mock.calls[0][0];
      const receivedRunId = receivedMessage.runId;
      const message1: WorkerToPoolMessage<string> = { runId: receivedRunId - 1, success: true, output: 'm1' };
      const message2: WorkerToPoolMessage<string> = { runId: receivedRunId + 1, success: true, output: 'm2' };
      const message3: WorkerToPoolMessage<string> = { runId: receivedRunId + 1, success: false, error: 'm3' };
      const onMessageHandler = on.mock.calls.find(([eventName]) => eventName === 'message')![1];
      onMessageHandler(message1);
      onMessageHandler(message2);
      onMessageHandler(message3);

      // Assert
      expect(worker.isAvailable()).toBe(false); // still waiting messages for 'receivedRunId'
      expect(worker.isFaulty()).toBe(false);
      expect(postMessage).toHaveBeenCalledTimes(1);
      expect(onSuccess).not.toHaveBeenCalled();
      expect(onFailure).not.toHaveBeenCalled();
    });

    it('should call failure handler and mark the worker as faulty when receiving messageerror message', async () => {
      // Arrange
      const { on, postMessage } = mockWorker();
      const workerFileUrl = new URL('file:///worker.cjs');
      const workerId = 0;
      const onSuccess = jest.fn();
      const onFailure = jest.fn();
      const pool = new BasicPool<string, string>(workerFileUrl, workerId);
      const workerPromise = pool.spawnNewWorker();
      fireOnlineEvent(on);
      const worker = await workerPromise;
      worker.register('to-worker', onSuccess, onFailure);

      // Act
      const onErrorHandler = on.mock.calls.find(([eventName]) => eventName === 'messageerror')![1];
      onErrorHandler(new Error('failed to serialize/deserialize payload!')); // emulate messageerror message

      // Assert
      expect(onFailure).toHaveBeenCalledTimes(1);
      expect(worker.isAvailable()).toBe(true); // we can recover immediately from such problems
      expect(worker.isFaulty()).toBe(false);
      expect(postMessage).toHaveBeenCalledTimes(1);
      expect(onSuccess).not.toHaveBeenCalled();
    });

    it('should call failure handler and mark the worker as faulty when receiving error message', async () => {
      // Arrange
      const { on, postMessage } = mockWorker();
      const workerFileUrl = new URL('file:///worker.cjs');
      const workerId = 0;
      const onSuccess = jest.fn();
      const onFailure = jest.fn();
      const pool = new BasicPool<string, string>(workerFileUrl, workerId);
      const workerPromise = pool.spawnNewWorker();
      fireOnlineEvent(on);
      const worker = await workerPromise;
      worker.register('to-worker', onSuccess, onFailure);

      // Act
      const onErrorHandler = on.mock.calls.find(([eventName]) => eventName === 'error')![1];
      onErrorHandler(new Error('boom!')); // emulate error message

      // Assert
      expect(onFailure).toHaveBeenCalledTimes(1);
      expect(worker.isAvailable()).toBe(false); // we don't want to recover such worker
      expect(worker.isFaulty()).toBe(true);
      expect(postMessage).toHaveBeenCalledTimes(1);
      expect(onSuccess).not.toHaveBeenCalled();
    });

    it('should call failure handler and mark the worker as faulty when receiving exit message', async () => {
      // Arrange
      const { on, postMessage } = mockWorker();
      const workerFileUrl = new URL('file:///worker.cjs');
      const workerId = 0;
      const onSuccess = jest.fn();
      const onFailure = jest.fn();
      const pool = new BasicPool<string, string>(workerFileUrl, workerId);
      const workerPromise = pool.spawnNewWorker();
      fireOnlineEvent(on);
      const worker = await workerPromise;
      worker.register('to-worker', onSuccess, onFailure);

      // Act
      const exitCode = 101;
      const onExitHandler = on.mock.calls.find(([eventName]) => eventName === 'exit')![1];
      onExitHandler(exitCode); // emulate exit message

      // Assert
      expect(onFailure).toHaveBeenCalledTimes(1);
      expect(worker.isAvailable()).toBe(false); // we don't want to recover such worker
      expect(worker.isFaulty()).toBe(true);
      expect(postMessage).toHaveBeenCalledTimes(1);
      expect(onSuccess).not.toHaveBeenCalled();
    });
  });

  describe('faulty worker', () => {
    it('should throw when spawning worker if messageerror received before online', async () => {
      // Arrange
      const { on } = mockWorker();
      const workerFileUrl = new URL('file:///worker.cjs');
      const workerId = 0;
      const pool = new BasicPool<string, string>(workerFileUrl, workerId);
      const workerPromise = pool.spawnNewWorker();

      // Act
      const onExitHandler = on.mock.calls.find(([eventName]) => eventName === 'messageerror')![1];
      onExitHandler(new Error('Failure in serialization or deserialization')); // emulate messageerror message

      // Assert
      await expect(workerPromise).rejects.toThrowError();
    });

    it('should throw when spawning worker if error received before online', async () => {
      // Arrange
      const { on } = mockWorker();
      const workerFileUrl = new URL('file:///worker.cjs');
      const workerId = 0;
      const pool = new BasicPool<string, string>(workerFileUrl, workerId);
      const workerPromise = pool.spawnNewWorker();

      // Act
      const onExitHandler = on.mock.calls.find(([eventName]) => eventName === 'error')![1];
      onExitHandler(new Error('An error')); // emulate error message

      // Assert
      await expect(workerPromise).rejects.toThrowError();
    });

    it('should throw when spawning worker if exit received before online', async () => {
      // Arrange
      const { on } = mockWorker();
      const workerFileUrl = new URL('file:///worker.cjs');
      const workerId = 0;
      const pool = new BasicPool<string, string>(workerFileUrl, workerId);
      const workerPromise = pool.spawnNewWorker();

      // Act
      const exitCode = 101;
      const onExitHandler = on.mock.calls.find(([eventName]) => eventName === 'exit')![1];
      onExitHandler(exitCode); // emulate exit message

      // Assert
      await expect(workerPromise).rejects.toThrowError();
    });
  });
});

// Helpers

function mockWorker() {
  const Worker = jest.spyOn(WorkerThreadsMock, 'Worker');
  const on = jest.fn();
  const postMessage = jest.fn();
  Worker.mockImplementation(
    () =>
      ({
        on,
        postMessage,
      } as unknown as WorkerThreadsMock.Worker)
  );
  return { Worker, on, postMessage };
}

function fireOnlineEvent(on: jest.Mock<any, any>) {
  const onOnlineHandler = on.mock.calls.find(([eventName]) => eventName === 'online')![1];
  onOnlineHandler();
}
