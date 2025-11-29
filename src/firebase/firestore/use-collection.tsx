'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Query,
  onSnapshot,
  DocumentData,
  FirestoreError,
  QuerySnapshot,
  CollectionReference,
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { useFirestore } from '..';

/** Utility type to add an 'id' field to a given type T. */
export type WithId<T> = T & { id: string };

/**
 * Interface for the return value of the useCollection hook.
 * @template T Type of the document data.
 */
export interface UseCollectionResult<T> {
  data: WithId<T>[]; // Document data with ID.
  loading: boolean;       // True if loading.
  error: FirestoreError | Error | null; // Error object, or null.
}

/* Internal implementation of Query:
  https://github.com/firebase/firebase-js-sdk/blob/c5f08a9bc5da0d2b0207802c972d53724ccef055/packages/firestore/src/lite-api/reference.ts#L143
*/
export interface InternalQuery extends Query<DocumentData> {
  _query: {
    path: {
      canonicalString(): string;
      toString(): string;
    }
  }
}

/**
 * React hook to subscribe to a Firestore collection or query in real-time.
 * Handles nullable references/queries.
 * 
 * IMPORTANT: You MUST memoize the `query` argument if it's constructed inside the component,
 * otherwise you will cause an infinite re-render loop.
 *  
 * @template T Optional type for document data. Defaults to any.
 * @param {string | CollectionReference | Query} collectionPathOrQuery -
 * The path to the collection (string) or a pre-made Firestore Query/CollectionReference object.
 * @param {Query | null} query - An optional Firestore query to apply to the collection.
 * @returns {UseCollectionResult<T>} Object with data, loading, error.
 */
export function useCollection<T = any>(
  collectionPathOrQuery: string | CollectionReference | Query,
  query: Query | null = null,
): UseCollectionResult<T> {
  type ResultItemType = WithId<T>;
  type StateDataType = ResultItemType[];

  const [data, setData] = useState<StateDataType>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<FirestoreError | Error | null>(null);
  
  const db = useFirestore();

  const finalQuery = useMemo(() => {
    if (typeof collectionPathOrQuery === 'string') {
        return query || collection(db, collectionPathOrQuery);
    }
    return collectionPathOrQuery;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [db, collectionPathOrQuery, query]);


  useEffect(() => {
    if (!finalQuery) {
      setData([]);
      setLoading(false);
      return;
    }
    
    setLoading(true);

    const unsubscribe = onSnapshot(
      finalQuery as Query,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const results: ResultItemType[] = snapshot.docs.map(doc => ({
            ...(doc.data() as T),
            id: doc.id
        }));
        setData(results);
        setError(null);
        setLoading(false);
      },
      (err: FirestoreError) => {
        const path: string =
          (finalQuery.type === 'collection')
            ? (finalQuery as CollectionReference).path
            : (finalQuery as unknown as InternalQuery)._query.path.canonicalString()

        const contextualError = new FirestorePermissionError({
          operation: 'list',
          path,
        })

        setError(contextualError)
        setData([])
        setLoading(false)
        errorEmitter.emit('permission-error', contextualError);
      }
    );

    return () => unsubscribe();
  }, [finalQuery]);

  return { data, loading, error };
}

// Helper to create a collection reference, needed for query building
import { collection } from 'firebase/firestore';
