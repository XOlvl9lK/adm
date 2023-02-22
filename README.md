# administration-backend
Бэкэнд компонента "Администрирование"

## Переменные окружения, используемые приложением:

| Наименование                  | Описание                              | Значение на DEV-стенде                     |
|-------------------------------|:--------------------------------------|:-------------------------------------------|
| APP_PORT                      | Порт развёртывания                    | 3000                                       |
| APP_LOG_PATH                  | Путь расположения файла с логами      | /opt/administration-backend.log            |
| DB_HOST                       | Хост базы данных                      | 172.29.30.62                               |
| DB_PORT                       | Порт базы данных                      | 5432                                       |
| DB_DATABASE                   | Наименование базы данных              | gas-ps-integration                         |
| DB_USERNAME                   | Юзернейм пользователя базы данных     | postgres                                   |
| DB_PASSWORD                   | Пароль пользователя базы данных       | postgres                                   |
| ELASTICSEARCH_HOST            | Хост Elasticsearch                    | http://172.29.30.75                        |
| ELASTICSEARCH_PORT            | Порт Elasticsearch                    | 9200                                       |
| ELASTICSEARCH_USERNAME        | Логин Elasticsearch                   | grub                                       |
| ELASTICSEARCH_PASSWORD        | Пароль Elasticsearch                  | hb1k5rW4                                   |
| KAFKA_HOST                    | Хост Kafka                            | 172.29.30.57                               |
| KAFKA_PORT                    | Порт Kafka                            | 9092                                       |
| NSI_DICTIONARY_URL            | URL для получения справочников из НСИ | https://gasps-dev.gost-group.com/nsi       |
| NSI_DICTIONARY_LOGIN          | Логин НСИ                             | gasps                                      |
| NSI_DICTIONARY_PASSWORD       | Пароль НСИ                            | Hfcjhn9C4n7VcHE6                           |
| NSI_DICTIONARY_DATA_HEAP_SIZE | Кол-во записей в одном запросе к НСИ  | 500                                        |
| DIB_URL                       | URL для получения пользователя из ДИБ | https://gasps-dev.gost-group.com           |
| MINIO_END_POINT               | Эндпоинт для minio                    | 172.29.30.58                               |
| MINIO_PORT                    | Порт для minio                        | 9000                                       |
| MINIO_ACCESS_KEY              | Minio Access Key                      | integration-5Msk1V3xfaWzHtBsMnlCQ          |
| MINIO_SECRET_KEY              | Minio Secret Key                      | LXvCIGdjUgvd6pLmbFEm9bmjqpHjThAAnPlSrzt3L8 |
| MINIO_BUCKET                  | Бакет minio                           | integration                                |

## Развёртывание приложения с помощью Docker

Необходимо установить на машину Docker

1. Склонировать данный репозиторий
2. В корневой папке репозитория в терминале выполнить команду `docker build -t administration-backend -f ./Dockerfile .`
3. В корневой папке репозитория в терминале выполнить команду, заменив значения в символах <> на необходимые значения (описаны в таблице выше)
   `docker run -itd -p 3001:3001 -e APP_PORT=<APP_PORT> -e APP_LOG_PATH=<APP_LOG_PATH> -e DB_HOST=<DB_HOST> -e DB_PORT=<DB_PORT> -e DB_DATABASE=<DB_DATABASE> -e DB_USERNAME=<DB_USERNAME> -e DB_PASSWORD=<DB_PASSWORD> -e ELASTICSEARCH_HOST=<ELASTICSEARCH_HOST> -e ELASTICSEARCH_PORT=<ELASTICSEARCH_PORT> -e ELASTICSEARCH_USERNAME=<ELASTICSEARCH_USERNAME> -e ELASTICSEARCH_PASSWORD=<ELASTICSEARCH_PASSWORD> -e KAFKA_HOST=<KAFKA_HOST> -e KAFKA_PORT=<KAFKA_PORT> -e NSI_DICTIONARY_URL=<NSI_DICTIONARY_URL> -e NSI_DICTIONARY_LOGIN=<NSI_DICTIONARY_LOGIN> -e NSI_DICTIONARY_PASSWORD=<NSI_DICTIONARY_PASSWORD> -e NSI_DICTIONARY_DATA_HEAP_SIZE=<NSI_DICTIONARY_DATA_HEAP_SIZE> -e DIB_URL=<DIB_URL> -e MINIO_END_POINT=<MINIO_POINT> -e MINIO_PORT=<MINIO_PORT> -e MINIO_ACCESS_KEY=<MINIO_ACCESS_KEY> -e MINIO_SECRET_KEY=<MINIO_SECRET_KEY> -e MINIO_BUCKET=<MINIO_BUCKET> administration-backend`  
   подставляя после знака "=" нужные значения переменных окружения

## Развёртывание приложения

Необходимо установить следующее программное обеспечение последних версий: Node JS, PostgreSQL, Git, Elasticsearch, Kafka

1. Склонировать данный репозиторий
2. Установить переменные окружения, указанные в таблице выше на машине:
3. В корневой папке в терминале выполнить команду `npm install`
4. В корневой папке в терминале выполнить команду `npm run build`
5. В корневой папке в терминале выполнить команду `npm run start:prod`
