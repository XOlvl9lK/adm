import { Client } from '@elastic/elasticsearch';
import ClientMock, { MockPattern, ResolverFn } from '@elastic/elasticsearch-mock';
import { ElasticService } from '@modules/elastic/services/elastic.service';
import { TestHelpers } from '@common/test/testHelpers';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Mock = require('@elastic/elasticsearch-mock');

export class ElasticMock {
  private readonly clientMock: ClientMock;
  private readonly helpers: ReturnType<TestHelpers['getHelpers']>;

  constructor() {
    this.clientMock = new Mock();
    this.helpers = new TestHelpers().getHelpers();
  }

  add(pattern: MockPattern, resolver: ResolverFn): ElasticMock {
    this.clientMock.add(pattern, resolver);
    return this;
  }

  addSearch<T>(mockValue: T) {
    return this.add(
      {
        method: 'POST',
        path: '/:index/_search',
      },
      () => {
        return this.helpers.getSearchResult(mockValue);
      },
    );
  }

  addCount() {
    return this.add(
      {
        method: 'GET',
        path: '/:index/_count',
      },
      () => {
        return {
          count: this.helpers.random.count,
        };
      },
    );
  }

  addMget<T>(mockValue: T) {
    return this.add(
      {
        method: 'GET',
        path: '/:index/_mget',
      },
      () => {
        return this.helpers.getMgetResult(mockValue);
      },
    );
  }

  build() {
    return {
      elasticMockProvider: {
        provide: ElasticService,
        useValue: {
          client: new Client({
            node: 'http://localhost:9200',
            Connection: this.clientMock.getConnection(),
          }),
        },
      },
      helpers: this.helpers,
    };
  }
}
